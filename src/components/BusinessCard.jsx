import { Star, MapPin } from 'lucide-react';
import { categories } from '../data/mockData';

export default function BusinessCard({ business, onClick }) {
  const categoryLabel = categories.find((c) => c.id === business.category)?.label || business.category;

  const renderStars = (rating) => {
    const full = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    const stars = [];
    for (let i = 0; i < full; i++) {
      stars.push(<Star key={i} size={13} fill="currentColor" />);
    }
    if (hasHalf) {
      stars.push(<Star key="half" size={13} fill="currentColor" opacity={0.5} />);
    }
    return stars;
  };

  return (
    <article
      className={`business-card ${business.sponsored ? 'sponsored' : ''}`}
      onClick={() => onClick(business)}
    >
      {business.sponsored && <div className="sponsored-badge">Sponsorisé</div>}
      <img className="card-image" src={business.image} alt={business.name} />
      <div className="card-body">
        <div className="card-category">{categoryLabel}</div>
        <h3 className="card-name">{business.name}</h3>
        <p className="card-description">{business.description}</p>
        <div className="card-rating">
          <div className="stars">{renderStars(business.rating)}</div>
          <span className="rating-number">{business.rating}</span>
          <span className="review-count">({business.reviewCount} avis)</span>
        </div>
        <div className="card-location">
          <MapPin size={12} />
          <span>{business.city}, {business.country}</span>
        </div>
        <div className="card-tags">
          {business.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      </div>
    </article>
  );
}
