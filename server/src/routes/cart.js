import express from 'express';
import { authRequired } from '../middleware/auth.js';
import { parseProduct, pool } from '../db.js';

const router = express.Router();

async function getCart(userId) {
  const [rows] = await pool.execute(
    `SELECT c.id AS cart_id, c.quantity, p.*,
       (SELECT GROUP_CONCAT(pi.image_url ORDER BY pi.sort_order SEPARATOR '||')
        FROM product_images pi
        WHERE pi.product_id = p.id) AS images
     FROM carts c
     JOIN products p ON p.id = c.product_id
     WHERE c.user_id = :userId
     ORDER BY c.id DESC`,
    { userId }
  );

  return rows.map((row) => ({
    cartId: row.cart_id,
    quantity: row.quantity,
    product: parseProduct(row)
  }));
}

router.get('/', authRequired, async (req, res) => {
  res.json(await getCart(req.user.id));
});

router.post('/', authRequired, async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  await pool.execute(
    `INSERT INTO carts (user_id, product_id, quantity)
     VALUES (:userId, :productId, :quantity)
     ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
    { userId: req.user.id, productId, quantity }
  );

  res.status(201).json(await getCart(req.user.id));
});

router.patch('/:productId', authRequired, async (req, res) => {
  const quantity = Math.max(1, Number(req.body.quantity || 1));

  await pool.execute('UPDATE carts SET quantity = :quantity WHERE user_id = :userId AND product_id = :productId', {
    userId: req.user.id,
    productId: req.params.productId,
    quantity
  });

  res.json(await getCart(req.user.id));
});

router.delete('/:productId', authRequired, async (req, res) => {
  await pool.execute('DELETE FROM carts WHERE user_id = :userId AND product_id = :productId', {
    userId: req.user.id,
    productId: req.params.productId
  });

  res.json(await getCart(req.user.id));
});

export default router;
