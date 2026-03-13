import { categories } from '../data/mockData';

export default function Categories({ activeCategory, onCategoryChange }) {
  return (
    <section className="categories-section">
      <div className="categories-scroll">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`category-chip ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => onCategoryChange(cat.id)}
          >
            <span className="chip-icon">{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>
    </section>
  );
}
