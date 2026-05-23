import express from "express";
import { pool, parseProduct } from "../db.js";

const router = express.Router();


// Get all products
router.get("/", async (req, res) => {
  try {
    const { search = "", category } = req.query;

    let sql = `
      SELECT p.*,
      (
        SELECT GROUP_CONCAT(
          pi.image_url SEPARATOR '||'
        )
        FROM product_images pi
        WHERE pi.product_id = p.id
      ) AS images
      FROM products p
      WHERE p.name LIKE ?
    `;

    const values = [`%${search}%`];

    if (category && category !== "all") {
      sql += ` AND p.category = ?`;
      values.push(category);
    }

    sql += ` ORDER BY p.id DESC`;

    const [rows] = await pool.execute(sql, values);

    res.json(rows.map(parseProduct));

  } catch (error) {
    console.error("Products fetch error:", error);

    res.status(500).json({
      message: "Failed to fetch products",
      error: error.message
    });
  }
});

// Get single product
router.get("/:id", async (req, res) => {
  try {

    const [rows] = await pool.execute(
      `
      SELECT p.*,
      (
        SELECT GROUP_CONCAT(
          pi.image_url SEPARATOR '||'
        )
        FROM product_images pi
        WHERE pi.product_id = p.id
      ) AS images
      FROM products p
      WHERE p.id = ?
      `,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.json(parseProduct(rows[0]));

  } catch (error) {

    console.error("Product details error:", error);

    res.status(500).json({
      message: "Failed to fetch product",
      error: error.message
    });
  }
});

export default router;