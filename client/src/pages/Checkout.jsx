import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api, formatPrice } from '../api.js';

export default function Checkout() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [cart, setCart] = useState([]);
  const [loadingCart, setLoadingCart] = useState(!state?.buyNowProduct);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    addressLine1: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [error, setError] = useState('');
  const [isPlacing, setIsPlacing] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);

  useEffect(() => {
    if (!state?.buyNowProduct) {
      api('/cart').then(setCart).finally(() => setLoadingCart(false));
    }
  }, [state]);

  const items = state?.buyNowProduct
    ? [{ product: state.buyNowProduct, quantity: state.quantity || 1 }]
    : cart;
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0), [items]);
  const shipping = subtotal > 499 || subtotal === 0 ? 0 : 49;
  const total = subtotal + shipping;

  async function placeOrder(event) {
    event.preventDefault();
    if (isPlacing) return;
    setError('');
    setIsPlacing(true);

    try {
      const order = await api('/orders', {
        method: 'POST',
        body: JSON.stringify({
          shippingAddress: form,
          buyNowProductId: state?.buyNowProduct?.id,
          buyNowQuantity: state?.quantity || 1
        })
      });
      navigate(`/order-confirmation/${order.orderNumber}`, { replace: true });
    } catch (err) {
      setError(err.message);
      setIsPlacing(false);
    }
  }

  function reviewOrder(event) {
    event.preventDefault();
    setError('');
    setIsReviewing(true);
  }

  return (
    <section className="two-column">
      <form className="auth-card checkout-form" onSubmit={isReviewing ? placeOrder : reviewOrder}>
        <h1>Shipping Address</h1>
        {!isReviewing ? (
          Object.keys(form).map((key) => (
            <label key={key}>
              {key.replace(/([A-Z])/g, ' $1')}
              <input
                type={key === 'email' ? 'email' : 'text'}
                value={form[key]}
                onChange={(event) => setForm({ ...form, [key]: event.target.value })}
                required
              />
            </label>
          ))
        ) : (
          <div className="review-panel">
            <h2>Review before placing order</h2>
            <p><strong>Name:</strong> {form.fullName}</p>
            <p><strong>Email:</strong> {form.email}</p>
            <p><strong>Phone:</strong> {form.phone}</p>
            <p><strong>Address:</strong> {form.addressLine1}, {form.city}, {form.state} - {form.pincode}</p>
            <button type="button" className="outline-button" onClick={() => setIsReviewing(false)}>Edit address</button>
          </div>
        )}
        {error && <p className="error">{error}</p>}
        <button className="buy-button" disabled={loadingCart || isPlacing || !items.length}>
          {isPlacing ? 'Placing order...' : isReviewing ? 'Place Order' : 'Review Order'}
        </button>
      </form>

      <aside className="summary-box">
        <h2>{isReviewing ? 'Review Order Summary' : 'Order Summary'}</h2>
        {items.map((item) => (
          <p key={item.product.id}>{item.product.name} x {item.quantity}</p>
        ))}
        <hr />
        <p>Subtotal: <strong>{formatPrice(subtotal)}</strong></p>
        <p>Shipping: <strong>{shipping ? formatPrice(shipping) : 'Free'}</strong></p>
        <p className="summary-total">Total: {formatPrice(total)}</p>
      </aside>
    </section>
  );
}
