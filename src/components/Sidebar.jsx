import { categories } from '../data/mockData';

export default function Sidebar({ ads = [], onCategoryChange }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-filters">
        <div className="filter-title">Filtres avancés</div>

        <div className="filter-group">
          <div className="filter-label">Catégorie</div>
          <select
            className="filter-select"
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <div className="filter-label">Pays</div>
          <select className="filter-select">
            <option value="">Tous les pays</option>
            <option value="france">France</option>
            <option value="japon">Japon</option>
            <option value="usa">États-Unis</option>
          </select>
        </div>

        <div className="filter-group">
          <div className="filter-label">Note minimum</div>
          <div className="filter-rating-options">
            {[4.5, 4.0, 3.5, 3.0].map((r) => (
              <label key={r} className="filter-rating-option">
                <input type="radio" name="rating" value={r} />
                {r}+ étoiles
              </label>
            ))}
          </div>
        </div>
      </div>

      {ads.map((ad) => (
        <div key={ad.id} className="sidebar-ad">
          <img className="ad-image" src={ad.image} alt={ad.title} />
          <div className="ad-body">
            <div className="ad-label">Publicité</div>
            <div className="ad-title">{ad.title}</div>
            <p className="ad-description">{ad.description}</p>
            <a href="#" className="ad-cta">{ad.cta} →</a>
          </div>
        </div>
      ))}
    </aside>
  );
}
