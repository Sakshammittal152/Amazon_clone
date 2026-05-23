import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js';
import { authRequired } from '../middleware/auth.js';

const router = express.Router();

function signToken(user) {
  return jwt.sign({ id: user.id, email: user.email, name: user.name }, process.env.JWT_SECRET || 'dev_secret', {
    expiresIn: '7d'
  });
}

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  try {
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password_hash) VALUES (:name, :email, :passwordHash)',
      { name, email, passwordHash }
    );
    const user = { id: result.insertId, name, email };
    res.status(201).json({ user, token: signToken(user) });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Signup failed' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const [rows] = await pool.execute('SELECT * FROM users WHERE email = :email', { email });
  const user = rows[0];

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const safeUser = { id: user.id, name: user.name, email: user.email };
  res.json({ user: safeUser, token: signToken(safeUser) });
});

router.get('/me', authRequired, async (req, res) => {
  const [rows] = await pool.execute('SELECT id, name, email FROM users WHERE id = :id', { id: req.user.id });
  res.json({ user: rows[0] });
});

export default router;
