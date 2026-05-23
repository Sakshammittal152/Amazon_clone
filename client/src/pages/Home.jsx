import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api, categories } from '../api.js';
import ProductGrid from '../components/ProductGrid.jsx';

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const category = searchParams.get('category') || 'all';
  const search = searchParams.get('search') || '';

  useEffect(() => {
    setLoading(true);
    api(`/products?category=${category}&search=${encodeURIComponent(search)}`)
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [category, search]);

  function selectCategory(nextCategory) {
    const params = new URLSearchParams(searchParams);
    params.set('category', nextCategory);
    setSearchParams(params);
  }

  return (
    <>
      <section className="hero-band">
        <div>
          <p>Hot drops. Every hour.</p>
          <h1>From wishlist to doorstep, one tap away.</h1>
        </div>
      </section>

      <section className="filters-row">
        {categories.map((item) => (
          <button className={item === category ? 'active' : ''} onClick={() => selectCategory(item)} key={item}>
            {item === 'all' ? 'All' : item}
          </button>
        ))}
      </section>

      {loading ? <div className="empty-state">Loading products...</div> : <ProductGrid products={products} />}
    </>
  );
}
