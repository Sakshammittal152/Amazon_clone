import express from 'express';
import { authRequired } from '../middleware/auth.js';
import { parseProduct, pool } from '../db.js';

const router = express.Router();

router.get('/', authRequired, async (req, res) => {
  const [rows] = await pool.execute(
    `SELECT p.*,
       (SELECT GROUP_CONCAT(pi.image_url ORDER BY pi.sort_order SEPARATOR '||')
        FROM product_images pi
        WHERE pi.product_id = p.id) AS images
     FROM wishlist w
     JOIN products p ON p.id = w.product_id
     WHERE w.user_id = :userId
     ORDER BY w.id DESC`,
    { userId: req.user.id }
  );

  res.json(rows.map(parseProduct));
});

router.post('/', authRequired, async (req, res) => {
  await pool.execute('INSERT IGNORE INTO wishlist (user_id, product_id) VALUES (:userId, :productId)', {
    userId: req.user.id,
    productId: req.body.productId
  });

  res.status(201).json({ message: 'Added to wishlist' });
});

router.delete('/:productId', authRequired, async (req, res) => {
  await pool.execute('DELETE FROM wishlist WHERE user_id = :userId AND product_id = :productId', {
    userId: req.user.id,
    productId: req.params.productId
  });

  res.json({ message: 'Removed from wishlist' });
});

export default router;
