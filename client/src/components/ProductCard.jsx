import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { api, formatPrice } from '../api.js';
import Toast from './Toast.jsx';

export default function ProductCard({ product, onWishlist }) {
  const imageUrl = product.images?.[0] || '/images/placeholder.png';
  const [toast, setToast] = useState('');

  function showToast(message) {
    setToast(message);
    window.setTimeout(() => setToast(''), 1800);
  }

  async function addToCart(event) {
    event.preventDefault();
    await api('/cart', {
      method: 'POST',
      body: JSON.stringify({ productId: product.id, quantity: 1 })
    });
    showToast('Added to cart');
  }

  async function addWishlist(event) {
    event.preventDefault();
    await api('/wishlist', {
      method: 'POST',
      body: JSON.stringify({ productId: product.id })
    });
    onWishlist?.();
    showToast('Added to wishlist');
  }

  return (
    <Link className="product-card" to={`/products/${product.id}`}>
      <Toast message={toast} />
      <button className="wish-floating" onClick={addWishlist} aria-label="Add to wishlist">
        <Heart size={18} />
      </button>
      <div className="product-image-wrap">
        <img src={imageUrl} alt={product.name} />
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <div className="rating"><Star size={15} fill="#f3a847" /> {product.rating}</div>
        <p className="price">{formatPrice(product.price)}</p>
        <p className={product.stock > 0 ? 'stock in' : 'stock out'}>{product.stock > 0 ? 'In stock' : 'Out of stock'}</p>
        <button className="cart-button" onClick={addToCart}>
          <ShoppingCart size={17} /> Add to Cart
        </button>
      </div>
    </Link>
  );
}
