import pg from 'pg';
const { Pool } = pg;

let pool;
function getPool() {
  if (!pool) pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  return pool;
}

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  try {
    const pool = getPool();

    await pool.query(`
      CREATE TABLE IF NOT EXISTS businesses (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        description TEXT,
        image TEXT,
        rating DECIMAL(2,1) DEFAULT 0,
        review_count INTEGER DEFAULT 0,
        email VARCHAR(255),
        phone VARCHAR(100),
        website VARCHAR(255),
        address TEXT,
        country VARCHAR(100),
        city VARCHAR(100),
        sponsored BOOLEAN DEFAULT FALSE,
        tags JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS ads (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image TEXT,
        cta VARCHAR(100),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    const { rows: existing } = await pool.query('SELECT COUNT(*) FROM businesses');
    if (parseInt(existing[0].count) > 0) {
      return res.json({ message: 'Database already seeded', businesses: existing[0].count });
    }

    const businesses = [
      ['Studio Lumière Digital', 'tech', 'Agence de développement web et mobile spécialisée dans les solutions sur mesure pour entreprises. Expertise en React, Node.js et applications cloud.', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop', 4.8, 124, 'contact@studiolumiere.com', '+33 1 42 56 78 90', 'www.studiolumiere.com', '42 Rue de Rivoli, Paris, France', 'France', 'Paris', true, '["Développement Web","Applications Mobiles","Cloud"]'],
      ['Le Comptoir Parisien', 'restaurant', 'Restaurant gastronomique proposant une cuisine française contemporaine avec des produits frais et de saison. Cadre élégant et chaleureux.', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop', 4.6, 89, 'reservation@comptoirparisien.fr', '+33 1 45 67 89 12', 'www.lecomptoirparisien.fr', '15 Boulevard Saint-Germain, Paris, France', 'France', 'Paris', true, '["Gastronomie","Cuisine Française","Fine Dining"]'],
      ['MedCare Clinique', 'sante', 'Centre médical pluridisciplinaire offrant des consultations en médecine générale, dermatologie, cardiologie et kinésithérapie.', 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=400&fit=crop', 4.9, 203, 'info@medcare-clinique.com', '+33 1 40 12 34 56', 'www.medcare-clinique.com', '8 Avenue des Champs-Élysées, Paris, France', 'France', 'Paris', false, '["Médecine Générale","Spécialistes","Soins"]'],
      ['BuildRight Construction', 'construction', 'Entreprise de construction et rénovation avec 20 ans d\'expérience. Projets résidentiels et commerciaux, du design à la livraison.', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop', 4.3, 67, 'projets@buildright.fr', '+33 4 91 23 45 67', 'www.buildright.fr', '120 La Canebière, Marseille, France', 'France', 'Marseille', false, '["Construction","Rénovation","Architecture"]'],
      ['Sakura Tech Solutions', 'tech', 'Consulting en transformation digitale et cybersécurité. Accompagnement des PME et grandes entreprises dans leur stratégie numérique.', 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=400&fit=crop', 4.7, 156, 'hello@sakuratech.jp', '+81 3 1234 5678', 'www.sakuratech.jp', '2-1 Marunouchi, Chiyoda, Tokyo, Japon', 'Japon', 'Tokyo', true, '["Cybersécurité","Consulting","Transformation Digitale"]'],
      ['Atelier Beauté Zen', 'beaute', 'Institut de beauté haut de gamme proposant soins du visage, massages, épilation et manucure dans un cadre zen et apaisant.', 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=400&fit=crop', 4.5, 98, 'rdv@atelierzen.com', '+33 1 48 76 54 32', 'www.atelierzen.com', '25 Rue du Faubourg Saint-Honoré, Paris, France', 'France', 'Paris', false, '["Soins Visage","Massage","Bien-être"]'],
      ['Cabinet Duval & Associés', 'juridique', 'Cabinet d\'avocats spécialisé en droit des affaires, propriété intellectuelle et droit du travail. Accompagnement personnalisé.', 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&h=400&fit=crop', 4.4, 45, 'contact@duval-associes.fr', '+33 1 53 89 01 23', 'www.duval-associes.fr', '50 Avenue Montaigne, Paris, France', 'France', 'Paris', false, '["Droit des Affaires","Propriété Intellectuelle","Droit du Travail"]'],
      ['Nova Financial Group', 'finance', 'Conseil en gestion de patrimoine et investissements. Solutions d\'épargne, assurance vie et optimisation fiscale pour particuliers et entreprises.', 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop', 4.6, 72, 'conseil@novafinancial.com', '+1 212 555 0199', 'www.novafinancial.com', '350 Fifth Avenue, New York, USA', 'États-Unis', 'New York', false, '["Patrimoine","Investissement","Fiscalité"]']
    ];

    for (const b of businesses) {
      await pool.query(
        'INSERT INTO businesses (name,category,description,image,rating,review_count,email,phone,website,address,country,city,sponsored,tags) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)',
        b
      );
    }

    await pool.query(`
      INSERT INTO ads (title, description, image, cta) VALUES
      ('Boostez votre visibilité', 'Devenez entreprise sponsorisée et apparaissez en tête des résultats.', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=250&fit=crop', 'En savoir plus'),
      ('Offre Premium', 'Encart publicitaire sur mesure pour maximiser votre impact digital.', 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=300&h=250&fit=crop', 'Découvrir')
    `);

    res.json({ message: 'Database seeded successfully', businesses: businesses.length, ads: 2 });
  } catch (err) {
    console.error('Seed error:', err);
    res.status(500).json({ error: err.message });
  }
}
