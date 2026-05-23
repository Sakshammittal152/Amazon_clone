import { Heart, ShoppingCart, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api, formatPrice } from '../api.js';
import Toast from '../components/Toast.jsx';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [toast, setToast] = useState('');

  useEffect(() => {
    api(`/products/${id}`).then(setProduct);
  }, [id]);

  if (!product) return <div className="empty-state">Loading product...</div>;
  const images = product.images?.length ? product.images : ['/images/placeholder.png'];

  async function addToCart() {
    await api('/cart', { method: 'POST', body: JSON.stringify({ productId: product.id, quantity: 1 }) });
    navigate('/cart');
  }

  async function addWishlist() {
    await api('/wishlist', { method: 'POST', body: JSON.stringify({ productId: product.id }) });
    setToast('Added to wishlist');
    window.setTimeout(() => setToast(''), 1800);
  }

  function buyNow() {
    navigate('/checkout', { state: { buyNowProduct: product, quantity: 1 } });
  }

  return (
    <section className="detail-layout">
      <Toast message={toast} />
      <div className="carousel">
        <div className="thumbs">
          {images.map((image, index) => (
            <button className={index === imageIndex ? 'active' : ''} onClick={() => setImageIndex(index)} key={image}>
              <img src={image} alt={`${product.name} ${index + 1}`} />
            </button>
          ))}
        </div>
        <div className="main-image">
          <img src={images[imageIndex]} alt={product.name} />
        </div>
      </div>

      <div className="detail-copy">
        <p className="category-label">{product.category}</p>
        <h1>{product.name}</h1>
        <p className="detail-rating">Rating: {product.rating} out of 5</p>
        <p className="detail-price">{formatPrice(product.price)}</p>
        <p className={product.stock > 0 ? 'stock in' : 'stock out'}>{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</p>
        <p>{product.description}</p>

        <div className="specs">
          <h2>Specifications</h2>
          {Object.entries(product.specifications).map(([key, value]) => (
            <p key={key}><strong>{key}:</strong> {value}</p>
          ))}
        </div>

        <div className="detail-actions">
          <button onClick={addToCart} className="cart-button"><ShoppingCart size={18} /> Add to Cart</button>
          <button onClick={buyNow} className="buy-button"><Zap size={18} /> Buy Now</button>
          <button onClick={addWishlist} className="outline-button"><Heart size={18} /> Wishlist</button>
        </div>
      </div>
    </section>
  );
}
