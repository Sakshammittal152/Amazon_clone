import express from 'express';
import { parseProduct, pool } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { search = '', category = 'all' } = req.query;
  const values = { search: `%${search}%` };
  let sql = `
    SELECT p.*,
      (SELECT GROUP_CONCAT(pi.image_url ORDER BY pi.sort_order SEPARATOR '||')
       FROM product_images pi
       WHERE pi.product_id = p.id) AS images
    FROM products p
    WHERE p.name LIKE :search
  `;

  if (category && category !== 'all') {
    sql += ' AND p.category = :category';
    values.category = category;
  }

  sql += ' ORDER BY p.id DESC';

  const [rows] = await pool.execute(sql, values);
  res.json(rows.map(parseProduct));
});

router.get('/:id', async (req, res) => {
  const [rows] = await pool.execute(
    `SELECT p.*,
       (SELECT GROUP_CONCAT(pi.image_url ORDER BY pi.sort_order SEPARATOR '||')
        FROM product_images pi
        WHERE pi.product_id = p.id) AS images
     FROM products p
     WHERE p.id = :id`,
    { id: req.params.id }
  );

  if (!rows[0]) {
    return res.status(404).json({ message: 'Product not found' });
  }

  res.json(parseProduct(rows[0]));
});

export default router;
