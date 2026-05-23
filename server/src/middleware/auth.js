import jwt from 'jsonwebtoken';
import { pool } from '../db.js';

async function ensureDefaultUser() {
  await pool.execute(
    `INSERT IGNORE INTO users (id, name, email, password_hash)
     VALUES (1, 'Saksham', 'default@amazon-clone.local', '$2a$10$vV9ejsyHS4IN4/XcI2Qbm.LM40piV8jVWjk4VrmpeQAwzrFKOhLcW')`
  );
}

export async function authRequired(req, res, next) {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    await ensureDefaultUser();
    req.user = { id: 1, name: 'Saksham', email: 'default@amazon-clone.local', isDefault: true };
    return next();
  }

  try {
    const token = header.replace('Bearer ', '');
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}
