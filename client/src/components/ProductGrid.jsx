import ProductCard from './ProductCard.jsx';

export default function ProductGrid({ products, emptyText = 'No products found.' }) {
  if (!products.length) {
    return <div className="empty-state">{emptyText}</div>;
  }

  return (
    <section className="product-grid">
      {products.map((product) => (
        <ProductCard product={product} key={product.id} />
      ))}
    </section>
  );
}
