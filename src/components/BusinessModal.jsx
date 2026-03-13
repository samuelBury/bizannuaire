import { Star, X } from 'lucide-react';
import { categories } from '../data/mockData';

export default function BusinessModal({ business, onClose }) {
  if (!business) return null;

  const categoryLabel = categories.find((c) => c.id === business.category)?.label || business.category;

  const renderStars = (rating) => {
    const full = Math.floor(rating);
    const stars = [];
    for (let i = 0; i < full; i++) {
      stars.push(<Star key={i} size={14} fill="currentColor" />);
    }
    return stars;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={18} />
        </button>
        <img className="modal-image" src={business.image} alt={business.name} />
        <div className="modal-body">
          <div className="modal-category">{categoryLabel}</div>
          <h2 className="modal-name">{business.name}</h2>
          <div className="modal-rating">
            <div className="stars">{renderStars(business.rating)}</div>
            <span className="rating-number">{business.rating}</span>
            <span className="review-count">({business.reviewCount} avis)</span>
          </div>
          <p className="modal-description">{business.description}</p>
          <div className="modal-info-grid">
            <div className="modal-info-item">
              <span className="modal-info-label">Email</span>
              <span className="modal-info-value">
                <a href={`mailto:${business.email}`}>{business.email}</a>
              </span>
            </div>
            <div className="modal-info-item">
              <span className="modal-info-label">Téléphone</span>
              <span className="modal-info-value">{business.phone}</span>
            </div>
            <div className="modal-info-item">
              <span className="modal-info-label">Site web</span>
              <span className="modal-info-value">
                <a href={`https://${business.website}`} target="_blank" rel="noopener noreferrer">
                  {business.website}
                </a>
              </span>
            </div>
            <div className="modal-info-item">
              <span className="modal-info-label">Adresse</span>
              <span className="modal-info-value">{business.address}</span>
            </div>
          </div>
          <div className="modal-tags">
            {business.tags.map((tag) => (
              <span key={tag} className="modal-tag">{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
