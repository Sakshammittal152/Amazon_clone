import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    setError('');
    try {
      await signup(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form className="auth-card" onSubmit={submit}>
      <h1>Sign Up</h1>
      <label>Name<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /></label>
      <label>Email<input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required /></label>
      <label>Password<input type="password" minLength="6" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required /></label>
      {error && <p className="error">{error}</p>}
      <button className="cart-button">Create Account</button>
      <p>Already registered? <Link to="/login">Login</Link></p>
    </form>
  );
}
