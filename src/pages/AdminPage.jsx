import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categories } from '../data/mockData';
import { api } from '../api';
import { Trash2, Edit3, Plus, Star, ArrowLeft, ToggleLeft, ToggleRight, RefreshCw, Lock, LogOut } from 'lucide-react';

export default function AdminPage() {
  const [authed, setAuthed] = useState(() => !!sessionStorage.getItem('admin_token'));
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    const form = new FormData(e.target);
    try {
      const data = await api.login(form.get('username'), form.get('password'));
      if (data.token) {
        sessionStorage.setItem('admin_token', data.token);
        setAuthed(true);
      } else {
        setLoginError(data.error || 'Erreur de connexion');
      }
    } catch (err) {
      setLoginError(err.message || 'Identifiants incorrects');
    }
    setLoginLoading(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_token');
    setAuthed(false);
  };

  if (!authed) {
    return (
      <div className="admin-login">
        <form className="admin-login-card" onSubmit={handleLogin}>
          <div className="admin-login-icon"><Lock size={32} /></div>
          <h1>Administration</h1>
          <p>Connectez-vous pour accéder au panneau d'administration.</p>
          {loginError && <div className="admin-login-error">{loginError}</div>}
          <div className="admin-login-field">
            <label>Identifiant</label>
            <input name="username" type="text" required autoFocus placeholder="admin" />
          </div>
          <div className="admin-login-field">
            <label>Mot de passe</label>
            <input name="password" type="password" required placeholder="Mot de passe" />
          </div>
          <button type="submit" className="admin-btn primary" disabled={loginLoading} style={{ width: '100%', justifyContent: 'center' }}>
            {loginLoading ? 'Connexion...' : 'Se connecter'}
          </button>
          <Link to="/" className="admin-login-back">Retour au site</Link>
        </form>
      </div>
    );
  }

  return <AdminDashboard onLogout={handleLogout} />;
}

function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('businesses');
  const [businessList, setBusinessList] = useState([]);
  const [adList, setAdList] = useState([]);
  const [editingBusiness, setEditingBusiness] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    Promise.all([api.getBusinesses(), api.getAds()])
      .then(([biz, ads]) => {
        setBusinessList(biz.map(normalize));
        setAdList(ads);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const handleSave = async (business) => {
    if (editingBusiness) {
      await api.updateBusiness(business.id, business);
    } else {
      await api.createBusiness(business);
    }
    setEditingBusiness(null);
    setShowForm(false);
    loadData();
  };

  const handleDelete = async (id) => {
    await api.deleteBusiness(id);
    loadData();
  };

  const toggleSponsored = async (b) => {
    await api.updateBusiness(b.id, { ...b, sponsored: !b.sponsored });
    loadData();
  };

  const handleSeed = async () => {
    await api.seed();
    loadData();
  };

  const sponsoredCount = businessList.filter((b) => b.sponsored).length;

  return (
    <div className="admin">
      <aside className="admin-sidebar">
        <Link to="/" className="admin-logo">
          <div className="logo-icon">B</div>
          <div className="logo-text">Biz<span>Annuaire</span></div>
        </Link>
        <nav className="admin-nav">
          <button className={`admin-nav-item ${activeTab === 'businesses' ? 'active' : ''}`} onClick={() => setActiveTab('businesses')}>
            🏢 Entreprises <span className="nav-badge">{businessList.length}</span>
          </button>
          <button className={`admin-nav-item ${activeTab === 'sponsoring' ? 'active' : ''}`} onClick={() => setActiveTab('sponsoring')}>
            ⭐ Sponsoring <span className="nav-badge">{sponsoredCount}</span>
          </button>
          <button className={`admin-nav-item ${activeTab === 'ads' ? 'active' : ''}`} onClick={() => setActiveTab('ads')}>
            📢 Publicités <span className="nav-badge">{adList.length}</span>
          </button>
        </nav>
        <div className="admin-sidebar-footer">
          <button className="admin-back" onClick={handleSeed} style={{ border: 'none', background: 'none', cursor: 'pointer', marginBottom: '0.75rem', fontFamily: 'inherit' }}>
            <RefreshCw size={16} /> Seed la BDD
          </button>
          <Link to="/" className="admin-back">
            <ArrowLeft size={16} /> Voir le site
          </Link>
          <button className="admin-back" onClick={onLogout} style={{ border: 'none', background: 'none', cursor: 'pointer', marginTop: '0.75rem', fontFamily: 'inherit' }}>
            <LogOut size={16} /> Déconnexion
          </button>
        </div>
      </aside>

      <main className="admin-main">
        {loading && <p style={{ color: '#86868b' }}>Chargement...</p>}

        {!loading && activeTab === 'businesses' && (
          <>
            <div className="admin-header">
              <div>
                <h1>Gestion des entreprises</h1>
                <p className="admin-subtitle">{businessList.length} entreprises enregistrées</p>
              </div>
              <button className="admin-btn primary" onClick={() => { setEditingBusiness(null); setShowForm(true); }}>
                <Plus size={18} /> Ajouter une entreprise
              </button>
            </div>

            {showForm && (
              <BusinessForm
                business={editingBusiness || emptyBusiness()}
                onSave={handleSave}
                onCancel={() => { setShowForm(false); setEditingBusiness(null); }}
              />
            )}

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Entreprise</th>
                    <th>Catégorie</th>
                    <th>Ville</th>
                    <th>Note</th>
                    <th>Sponsorisé</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {businessList.map((b) => (
                    <tr key={b.id}>
                      <td>
                        <div className="table-business">
                          <img src={b.image} alt="" className="table-thumb" />
                          <div>
                            <div className="table-name">{b.name}</div>
                            <div className="table-email">{b.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="table-category">
                          {categories.find((c) => c.id === b.category)?.icon}{' '}
                          {categories.find((c) => c.id === b.category)?.label}
                        </span>
                      </td>
                      <td>{b.city}, {b.country}</td>
                      <td>
                        <div className="table-rating">
                          <Star size={13} fill="#ff9500" color="#ff9500" /> {b.rating}
                        </div>
                      </td>
                      <td>
                        <button className="sponsor-toggle" onClick={() => toggleSponsored(b)}>
                          {b.sponsored ? <ToggleRight size={24} color="#ff9500" /> : <ToggleLeft size={24} color="#d2d2d7" />}
                        </button>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button className="action-btn edit" onClick={() => { setEditingBusiness(b); setShowForm(true); }}>
                            <Edit3 size={15} />
                          </button>
                          <button className="action-btn delete" onClick={() => handleDelete(b.id)}>
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {!loading && activeTab === 'sponsoring' && (
          <>
            <div className="admin-header">
              <div>
                <h1>Gestion du sponsoring</h1>
                <p className="admin-subtitle">{sponsoredCount} entreprises sponsorisées</p>
              </div>
            </div>
            <div className="sponsor-grid">
              {businessList.map((b) => (
                <div key={b.id} className={`sponsor-card ${b.sponsored ? 'active' : ''}`}>
                  <img src={b.image} alt="" className="sponsor-card-img" />
                  <div className="sponsor-card-body">
                    <div className="sponsor-card-name">{b.name}</div>
                    <div className="sponsor-card-cat">
                      {categories.find((c) => c.id === b.category)?.icon}{' '}
                      {categories.find((c) => c.id === b.category)?.label}
                    </div>
                    <button className={`admin-btn ${b.sponsored ? 'warning' : 'primary'} small`} onClick={() => toggleSponsored(b)}>
                      {b.sponsored ? 'Retirer le sponsoring' : 'Sponsoriser'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {!loading && activeTab === 'ads' && (
          <>
            <div className="admin-header">
              <div>
                <h1>Gestion des publicités</h1>
                <p className="admin-subtitle">{adList.length} encarts publicitaires</p>
              </div>
              <button className="admin-btn primary">
                <Plus size={18} /> Ajouter un encart
              </button>
            </div>
            <div className="ads-grid">
              {adList.map((ad) => (
                <div key={ad.id} className="ad-admin-card">
                  <img src={ad.image} alt="" className="ad-admin-img" />
                  <div className="ad-admin-body">
                    <h3>{ad.title}</h3>
                    <p>{ad.description}</p>
                    <div className="ad-admin-cta">{ad.cta}</div>
                    <div className="ad-admin-actions">
                      <button className="action-btn edit"><Edit3 size={15} /></button>
                      <button className="action-btn delete" onClick={async () => { await api.deleteAd(ad.id); loadData(); }}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function emptyBusiness() {
  return { name: '', category: 'tech', description: '', image: '', rating: 0, reviewCount: 0, email: '', phone: '', website: '', address: '', country: '', city: '', sponsored: false, tags: [] };
}

function normalize(row) {
  return { ...row, reviewCount: row.review_count, tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags || [] };
}

function BusinessForm({ business, onSave, onCancel }) {
  const [form, setForm] = useState({ ...business, tags: Array.isArray(business.tags) ? business.tags.join(', ') : '' });

  const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...form, rating: parseFloat(form.rating) || 0, reviewCount: parseInt(form.reviewCount) || 0, tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean) });
  };

  return (
    <div className="admin-form-overlay">
      <form className="admin-form" onSubmit={handleSubmit}>
        <h2>{business.name ? 'Modifier' : 'Ajouter'} une entreprise</h2>
        <div className="form-grid">
          <div className="form-field"><label>Nom</label><input value={form.name} onChange={(e) => handleChange('name', e.target.value)} required /></div>
          <div className="form-field"><label>Catégorie</label><select value={form.category} onChange={(e) => handleChange('category', e.target.value)}>{categories.filter((c) => c.id !== 'all').map((c) => (<option key={c.id} value={c.id}>{c.icon} {c.label}</option>))}</select></div>
          <div className="form-field full"><label>Description</label><textarea value={form.description} onChange={(e) => handleChange('description', e.target.value)} rows={3} /></div>
          <div className="form-field full"><label>URL de l'image</label><input value={form.image} onChange={(e) => handleChange('image', e.target.value)} placeholder="https://..." /></div>
          <div className="form-field"><label>Email</label><input type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} /></div>
          <div className="form-field"><label>Téléphone</label><input value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} /></div>
          <div className="form-field"><label>Site web</label><input value={form.website} onChange={(e) => handleChange('website', e.target.value)} /></div>
          <div className="form-field"><label>Adresse</label><input value={form.address} onChange={(e) => handleChange('address', e.target.value)} /></div>
          <div className="form-field"><label>Ville</label><input value={form.city} onChange={(e) => handleChange('city', e.target.value)} /></div>
          <div className="form-field"><label>Pays</label><input value={form.country} onChange={(e) => handleChange('country', e.target.value)} /></div>
          <div className="form-field"><label>Note (0-5)</label><input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => handleChange('rating', e.target.value)} /></div>
          <div className="form-field"><label>Nombre d'avis</label><input type="number" value={form.reviewCount} onChange={(e) => handleChange('reviewCount', e.target.value)} /></div>
          <div className="form-field full"><label>Tags (séparés par des virgules)</label><input value={form.tags} onChange={(e) => handleChange('tags', e.target.value)} placeholder="Tag1, Tag2, Tag3" /></div>
        </div>
        <div className="form-actions">
          <button type="button" className="admin-btn secondary" onClick={onCancel}>Annuler</button>
          <button type="submit" className="admin-btn primary">Enregistrer</button>
        </div>
      </form>
    </div>
  );
}
