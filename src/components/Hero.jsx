import { Search } from 'lucide-react';

export default function Hero({ searchQuery, onSearchChange }) {
  return (
    <section className="hero">
      <h1>
        Trouvez <span className="gradient-text">l'entreprise</span>
        <br />qu'il vous faut.
      </h1>
      <p>L'annuaire professionnel international pour découvrir les meilleures entreprises.</p>
      <div className="search-container">
        <div className="search-bar">
          <div className="search-icon">
            <Search size={20} />
          </div>
          <input
            type="text"
            placeholder="Rechercher une entreprise, un métier, une ville..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <button className="search-btn">Rechercher</button>
        </div>
      </div>
    </section>
  );
}
