import { useState, useMemo, useEffect } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Categories from '../components/Categories';
import BusinessCard from '../components/BusinessCard';
import BusinessModal from '../components/BusinessModal';
import Sidebar from '../components/Sidebar';
import { api } from '../api';

export default function HomePage() {
  const [businesses, setBusinesses] = useState([]);
  const [ads, setAds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getBusinesses(), api.getAds()])
      .then(([biz, adData]) => {
        setBusinesses(biz.map(normalize));
        setAds(adData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredBusinesses = useMemo(() => {
    let filtered = [...businesses];

    if (activeCategory !== 'all') {
      filtered = filtered.filter((b) => b.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.description?.toLowerCase().includes(q) ||
          b.city?.toLowerCase().includes(q) ||
          b.country?.toLowerCase().includes(q) ||
          b.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    filtered.sort((a, b) => (b.sponsored ? 1 : 0) - (a.sponsored ? 1 : 0));
    return filtered;
  }, [searchQuery, activeCategory, businesses]);

  return (
    <>
      <Header />
      <Hero searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <section id="categories">
        <Categories activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
      </section>

      <div className="main-layout" id="parcourir">
        <main>
          <div className="results-header">
            <span className="results-count">
              {loading ? 'Chargement...' : `${filteredBusinesses.length} entreprise${filteredBusinesses.length !== 1 ? 's' : ''} trouvée${filteredBusinesses.length !== 1 ? 's' : ''}`}
            </span>
            <select className="sort-select">
              <option>Pertinence</option>
              <option>Note décroissante</option>
              <option>Nombre d'avis</option>
            </select>
          </div>
          <div className="business-grid">
            {filteredBusinesses.map((business) => (
              <BusinessCard
                key={business.id}
                business={business}
                onClick={setSelectedBusiness}
              />
            ))}
          </div>
        </main>
        <Sidebar ads={ads} onCategoryChange={setActiveCategory} />
      </div>

      <section id="sponsoring" className="sponsoring-section">
        <div className="sponsoring-inner">
          <h2>Boostez la visibilité de votre entreprise</h2>
          <p>Apparaissez en tête des résultats avec un encart sponsorisé et touchez des milliers de visiteurs chaque jour.</p>
          <div className="sponsoring-features">
            <div className="sponsoring-feature">
              <span className="feature-icon">🚀</span>
              <h3>Placement prioritaire</h3>
              <p>Votre entreprise en haut de chaque recherche pertinente.</p>
            </div>
            <div className="sponsoring-feature">
              <span className="feature-icon">📊</span>
              <h3>Visibilité maximale</h3>
              <p>Badge sponsorisé distinctif et mise en avant visuelle.</p>
            </div>
            <div className="sponsoring-feature">
              <span className="feature-icon">🎯</span>
              <h3>Ciblage par catégorie</h3>
              <p>Touchez exactement votre audience cible par métier.</p>
            </div>
          </div>
          <a href="#contact" className="sponsoring-cta">Nous contacter</a>
        </div>
      </section>

      <section id="contact" className="contact-section">
        <div className="contact-inner">
          <h2>Contactez-nous</h2>
          <p>Une question, une demande de sponsoring ou un partenariat ?</p>
          <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-row">
              <input type="text" placeholder="Votre nom" className="form-input" />
              <input type="email" placeholder="Votre email" className="form-input" />
            </div>
            <select className="form-input">
              <option value="">Sujet de votre message</option>
              <option>Demande de sponsoring</option>
              <option>Ajouter une entreprise</option>
              <option>Partenariat</option>
              <option>Autre</option>
            </select>
            <textarea placeholder="Votre message..." className="form-textarea" rows={5} />
            <button type="submit" className="form-submit">Envoyer le message</button>
          </form>
        </div>
      </section>

      <footer className="footer">
        © 2026 BizAnnuaire — L'annuaire professionnel international
      </footer>

      {selectedBusiness && (
        <BusinessModal
          business={selectedBusiness}
          onClose={() => setSelectedBusiness(null)}
        />
      )}
    </>
  );
}

function normalize(row) {
  return {
    ...row,
    reviewCount: row.review_count,
    tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags || [],
  };
}
