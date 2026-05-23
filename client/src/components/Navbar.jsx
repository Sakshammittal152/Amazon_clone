import { Heart, Home, PackageCheck, Search, ShoppingCart } from 'lucide-react';
import { Link, NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { categories } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const selectedCategory = searchParams.get('category') || 'all';
  const search = searchParams.get('search') || '';

  function submitSearch(event) {
    event.preventDefault();
    navigate(`/?category=${selectedCategory}&search=${encodeURIComponent(search)}`);
  }

  function updateCategory(category) {
    const params = new URLSearchParams(searchParams);
    params.set('category', category);
    setSearchParams(params);
    navigate(`/?${params.toString()}`);
  }

  function updateSearch(value) {
    const params = new URLSearchParams(searchParams);
    if (value) params.set('search', value);
    else params.delete('search');
    setSearchParams(params);
  }

  return (
    <header className="topbar">
      <Link to="/" className="brand" aria-label="Amazon clone home">
        <span>amazon</span><small>.in</small>
      </Link>

      <form className="search-box" onSubmit={submitSearch}>
        <select value={selectedCategory} onChange={(event) => updateCategory(event.target.value)} aria-label="Category">
          {categories.map((category) => (
            <option value={category} key={category}>
              {category === 'all' ? 'All' : category[0].toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
        <input
          value={search}
          onChange={(event) => updateSearch(event.target.value)}
          placeholder="Search Amazon.in"
          aria-label="Search products"
        />
        <button type="submit" aria-label="Search">
          <Search size={24} />
        </button>
      </form>

      <nav className="nav-actions">
        <NavLink to="/" title="Home"><Home size={19} /> <span>Home</span></NavLink>
        <NavLink to="/wishlist" title="Wishlist"><Heart size={19} /> <span>Wishlist</span></NavLink>
        <NavLink to="/orders" title="Orders"><PackageCheck size={19} /> <span>Orders</span></NavLink>
        <NavLink to="/cart" title="Cart"><ShoppingCart size={22} /> <span>Cart</span></NavLink>
        {user && !user.isDefault ? (
          <button className="account-button" onClick={logout}>Hi, {user.name.split(' ')[0]} | Logout</button>
        ) : (
          <Link className="account-link" to="/login">Login</Link>
        )}
      </nav>
    </header>
  );
}
