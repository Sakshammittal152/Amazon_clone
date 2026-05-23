import express from 'express';
import { authRequired } from '../middleware/auth.js';
import { parseProduct, pool } from '../db.js';
import { sendOrderEmail } from '../utils/email.js';

const router = express.Router();

router.get('/', authRequired, async (req, res) => {
  const [orders] = await pool.execute('SELECT * FROM orders WHERE user_id = :userId ORDER BY created_at DESC, id DESC', {
    userId: req.user.id
  });

  for (const order of orders) {
    const [items] = await pool.execute(
      `SELECT oi.quantity AS order_quantity, oi.price AS order_price, p.*,
        (SELECT GROUP_CONCAT(pi.image_url ORDER BY pi.sort_order SEPARATOR '||')
         FROM product_images pi
         WHERE pi.product_id = p.id) AS images
       FROM order_items oi
       JOIN products p ON p.id = oi.product_id
       WHERE oi.order_id = :orderId`,
      { orderId: order.id }
    );
    order.shipping_address =
      typeof order.shipping_address === 'string' ? JSON.parse(order.shipping_address) : order.shipping_address;
    order.items = items.map((item) => ({
      quantity: item.order_quantity,
      price: Number(item.order_price),
      product: parseProduct(item)
    }));
  }

  res.json(orders);
});

router.get('/:orderNumber', authRequired, async (req, res) => {
  const [orders] = await pool.execute('SELECT * FROM orders WHERE user_id = :userId AND order_number = :orderNumber', {
    userId: req.user.id,
    orderNumber: req.params.orderNumber
  });

  if (!orders[0]) {
    return res.status(404).json({ message: 'Order not found' });
  }

  const [items] = await pool.execute(
    `SELECT oi.quantity AS order_quantity, oi.price AS order_price, p.*,
       (SELECT GROUP_CONCAT(pi.image_url ORDER BY pi.sort_order SEPARATOR '||')
        FROM product_images pi
        WHERE pi.product_id = p.id) AS images
     FROM order_items oi
     JOIN products p ON p.id = oi.product_id
     WHERE oi.order_id = :orderId`,
    { orderId: orders[0].id }
  );

  const order = orders[0];
  order.shipping_address =
    typeof order.shipping_address === 'string' ? JSON.parse(order.shipping_address) : order.shipping_address;
  order.items = items.map((item) => ({
    quantity: item.order_quantity,
    price: Number(item.order_price),
    product: parseProduct(item)
  }));

  res.json(order);
});

router.post('/', authRequired, async (req, res) => {
  const { shippingAddress, buyNowProductId, buyNowQuantity = 1 } = req.body;

  if (!shippingAddress?.fullName || !shippingAddress?.email || !shippingAddress?.phone || !shippingAddress?.addressLine1) {
    return res.status(400).json({ message: 'Complete shipping address is required' });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    let items;
    if (buyNowProductId) {
      const [rows] = await connection.execute(
        `SELECT p.*,
           (SELECT GROUP_CONCAT(pi.image_url ORDER BY pi.sort_order SEPARATOR '||')
            FROM product_images pi
            WHERE pi.product_id = p.id) AS images
         FROM products p
         WHERE p.id = :productId`,
        { productId: buyNowProductId }
      );
      items = rows.map((product) => ({ product, quantity: Number(buyNowQuantity) }));
    } else {
      const [rows] = await connection.execute(
        `SELECT c.quantity, p.*,
           (SELECT GROUP_CONCAT(pi.image_url ORDER BY pi.sort_order SEPARATOR '||')
            FROM product_images pi
            WHERE pi.product_id = p.id) AS images
         FROM carts c
         JOIN products p ON p.id = c.product_id
         WHERE c.user_id = :userId`,
        { userId: req.user.id }
      );
      items = rows.map((row) => ({ product: row, quantity: row.quantity }));
    }

    if (!items.length) {
      await connection.rollback();
      return res.status(400).json({ message: 'No items to order' });
    }

    const unavailableItem = items.find((item) => Number(item.quantity) > Number(item.product.stock));
    if (unavailableItem) {
      await connection.rollback();
      return res.status(400).json({
        message: `Only ${unavailableItem.product.stock} unit(s) available for ${unavailableItem.product.name}`
      });
    }

    const subtotal = items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);
    const shipping = subtotal > 499 ? 0 : 49;
    const total = subtotal + shipping;
    const orderNumber = `AMZ-${Date.now()}-${req.user.id}`;

    const [orderResult] = await connection.execute(
      `INSERT INTO orders (user_id, order_number, subtotal, shipping, total, shipping_address)
       VALUES (:userId, :orderNumber, :subtotal, :shipping, :total, :shippingAddress)`,
      {
        userId: req.user.id,
        orderNumber,
        subtotal,
        shipping,
        total,
        shippingAddress: JSON.stringify(shippingAddress)
      }
    );

    for (const item of items) {
      await connection.execute(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (:orderId, :productId, :quantity, :price)',
        {
          orderId: orderResult.insertId,
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price
        }
      );
      await connection.execute('UPDATE products SET stock = GREATEST(stock - :quantity, 0) WHERE id = :productId', {
        quantity: item.quantity,
        productId: item.product.id
      });
    }

    if (!buyNowProductId) {
      await connection.execute('DELETE FROM carts WHERE user_id = :userId', { userId: req.user.id });
    }

    await connection.commit();

    const [users] = await pool.execute('SELECT id, name, email FROM users WHERE id = :id', { id: req.user.id });
    const emailRecipient = {
      ...(users[0] || req.user),
      name: shippingAddress.fullName,
      email: shippingAddress.email
    };
    const order = { orderNumber, subtotal, shipping, total };

    try {
      await sendOrderEmail(emailRecipient, order);
    } catch (emailError) {
      console.error(`Order ${orderNumber} was placed, but email sending failed:`, emailError.message);
    }

    res.status(201).json({ ...order, items: items.length });
  } catch (error) {
    try {
      await connection.rollback();
    } catch {
      // The transaction may already be committed if a post-order step fails.
    }
    console.error(error);
    res.status(500).json({ message: 'Order placement failed' });
  } finally {
    connection.release();
  }
});

export default router;
