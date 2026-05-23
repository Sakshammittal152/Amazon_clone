import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'amazon_clone',
  waitForConnections: true,
  connectionLimit: 10,
  namedPlaceholders: true
});

export function parseProduct(row) {
  const images = Array.isArray(row.images)
    ? row.images
    : String(row.images || '')
        .split('||')
        .filter(Boolean);

  return {
    ...row,
    price: Number(row.price),
    rating: Number(row.rating),
    specifications: typeof row.specifications === 'string' ? JSON.parse(row.specifications) : row.specifications,
    images
  };
}
