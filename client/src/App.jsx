import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import OrderConfirmation from './pages/OrderConfirmation.jsx';
import Orders from './pages/Orders.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Signup from './pages/Signup.jsx';
import Wishlist from './pages/Wishlist.jsx';

function PrivateRoute({ children }) {
  return children;
}

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="page">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
          <Route path="/wishlist" element={<PrivateRoute><Wishlist /></PrivateRoute>} />
          <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
          <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
          <Route path="/order-confirmation/:orderNumber" element={<PrivateRoute><OrderConfirmation /></PrivateRoute>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
