import { CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, formatPrice } from '../api.js';

export default function OrderConfirmation() {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api(`/orders/${orderNumber}`).then(setOrder);
  }, [orderNumber]);

  if (!order) return <div className="empty-state">Loading order...</div>;

  return (
    <section className="confirmation">
      <CheckCircle2 size={52} />
      <h1>Order placed successfully</h1>
      <p>Your order ID is <strong>{order.order_number}</strong>.</p>
      <p>Total paid: <strong>{formatPrice(order.total)}</strong></p>
      <div className="summary-box">
        <h2>Items</h2>
        {order.items.map((item) => (
          <p key={item.product.id}>{item.product.name} x {item.quantity}</p>
        ))}
      </div>
      <Link className="cart-button" to="/orders">View order history</Link>
    </section>
  );
}
