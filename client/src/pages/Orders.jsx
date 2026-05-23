import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, formatDate, formatPrice } from '../api.js';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api('/orders').then(setOrders).finally(() => setLoading(false));
  }, []);

  return (
    <section>
      <h1>Your Orders</h1>
      {loading && <div className="empty-state">Loading order history...</div>}
      {!loading && !orders.length && <div className="empty-state">No orders placed yet.</div>}
      {orders.map((order) => (
        <article className="order-card" key={order.id}>
          <div className="order-main">
            <div className="order-heading">
              <div>
                <h2>Order {order.order_number}</h2>
                <p>Status: {order.status}</p>
                <p>Placed on: {formatDate(order.created_at)}</p>
                {order.shipping_address?.email && <p>Email: {order.shipping_address.email}</p>}
              </div>
              <div>
                <p className="summary-total">{formatPrice(order.total)}</p>
                <Link className="outline-button" to={`/order-confirmation/${order.order_number}`}>View details</Link>
              </div>
            </div>
            <div className="order-items">
              {order.items?.map((item) => (
                <div className="order-item" key={`${order.id}-${item.product.id}`}>
                  <img src={item.product.images?.[0] || '/images/placeholder.png'} alt={item.product.name} />
                  <div>
                    <strong>{item.product.name}</strong>
                    <p>Qty: {item.quantity} x {formatPrice(item.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
