import { Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, formatPrice } from '../api.js';

export default function Cart() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api('/cart').then(setItems);
  }, []);

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0), [items]);

  async function updateQuantity(productId, quantity) {
    setItems(await api(`/cart/${productId}`, { method: 'PATCH', body: JSON.stringify({ quantity }) }));
  }

  async function remove(productId) {
    setItems(await api(`/cart/${productId}`, { method: 'DELETE' }));
  }

  return (
    <section className="two-column">
      <div>
        <h1>Shopping Cart</h1>
        {items.length === 0 && <div className="empty-state">Your cart is empty.</div>}
        {items.map((item) => (
          <article className="line-item" key={item.product.id}>
            <img src={item.product.images?.[0] || '/images/placeholder.png'} alt={item.product.name} />
            <div>
              <h2>{item.product.name}</h2>
              <p className="price">{formatPrice(item.product.price)}</p>
              <label>
                Qty
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(event) => updateQuantity(item.product.id, event.target.value)}
                />
              </label>
              <button className="text-button" onClick={() => remove(item.product.id)}><Trash2 size={16} /> Remove</button>
            </div>
          </article>
        ))}
      </div>

      <aside className="summary-box">
        <h2>Cart Summary</h2>
        <p>Subtotal ({items.length} items): <strong>{formatPrice(subtotal)}</strong></p>
        <p>Shipping: <strong>{subtotal > 499 || subtotal === 0 ? 'Free' : formatPrice(49)}</strong></p>
        <p className="summary-total">Total: {formatPrice(subtotal > 0 && subtotal <= 499 ? subtotal + 49 : subtotal)}</p>
        <Link className={items.length ? 'buy-button wide' : 'buy-button wide disabled'} to="/checkout">Proceed to Checkout</Link>
      </aside>
    </section>
  );
}
