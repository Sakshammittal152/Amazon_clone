import { ShoppingCart, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, formatPrice } from '../api.js';
import Toast from '../components/Toast.jsx';

export default function Wishlist() {
  const [products, setProducts] = useState([]);
  const [toast, setToast] = useState('');

  useEffect(() => {
    api('/wishlist').then(setProducts);
  }, []);

  async function remove(productId) {
    await api(`/wishlist/${productId}`, { method: 'DELETE' });
    setProducts(products.filter((product) => product.id !== productId));
  }

  async function addToCart(productId) {
    await api('/cart', { method: 'POST', body: JSON.stringify({ productId, quantity: 1 }) });
    setToast('Added to cart');
    window.setTimeout(() => setToast(''), 1800);
  }

  return (
    <section>
      <Toast message={toast} />
      <h1>Your Wishlist</h1>
      {!products.length && <div className="empty-state">Your wishlist is empty.</div>}
      <div className="product-grid">
        {products.map((product) => (
          <article className="product-card" key={product.id}>
            <Link to={`/products/${product.id}`} className="product-image-wrap"><img src={product.images?.[0] || '/images/placeholder.png'} alt={product.name} /></Link>
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="price">{formatPrice(product.price)}</p>
              <button className="cart-button" onClick={() => addToCart(product.id)}><ShoppingCart size={17} /> Add to Cart</button>
              <button className="text-button" onClick={() => remove(product.id)}><Trash2 size={16} /> Remove</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
