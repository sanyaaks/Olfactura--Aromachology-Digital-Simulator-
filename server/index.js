import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from './db/index.js';

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'olfactura_super_secret_key_2026';

// Middleware for JWT auth
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token == null) return res.status(401).json({ error: 'Missing token' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// --- AUTHENTICATION ---

app.post('/api/auth/register', async (req, res) => {
  const { email, password, name, company_name } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  try {
    const existing = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Create company first
    const companyRes = await pool.query(
      'INSERT INTO company (company_name, market_tier) VALUES ($1, $2) RETURNING company_id',
      [company_name || 'Independent', 'Standard']
    );
    const company_id = companyRes.rows[0].company_id;

    // Create user
    const userRes = await pool.query(
      'INSERT INTO users (company_id, name, email, role, password_hash) VALUES ($1, $2, $3, $4, $5) RETURNING user_id, name, email',
      [company_id, name, email, 'Client', password_hash]
    );

    const token = jwt.sign({ user_id: userRes.rows[0].user_id }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ status: 'success', token, user: userRes.rows[0] });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ user_id: user.user_id }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ status: 'success', token, user: { user_id: user.user_id, name: user.name, email: user.email } });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// --- SIMULATION & BRIEF CREATION ---

app.post('/api/simulate', authenticateToken, async (req, res) => {
  try {
    const { phase1, phase2, phase3 } = req.body;
    const user_id = req.user.user_id;
    
    // FR-002 & FR-004 logic
    const blueprint = {
      refId: `REF-${Math.floor(Math.random() * 10000)}`,
      materials: [],
      telemetry: {
        calmAlpha: 50,
        energyBeta: 50,
        focusGamma: 50,
      },
      volatility: {
        topNotes: 0,
        baseNotes: 0,
      }
    };

    if (phase1.vehicle === 'Roll-On / Pulse-Point Oil' && phase2.claim === 'Anxiety & Stress Reduction') {
      blueprint.materials.push({ name: 'Lavandin Heart', concentration: '45%' });
      blueprint.materials.push({ name: 'Tonka Bean Absolute', concentration: '15%' });
    } else {
      blueprint.materials.push({ name: 'Linalool (Standard)', concentration: '30%' });
    }

    // New additions based on Q-SE-004 Base Note Preference
    if (phase3.baseNotePreference === 'Woody') {
      blueprint.materials.push({ name: 'Sandalwood Base', concentration: '20%' });
    } else if (phase3.baseNotePreference === 'Musky') {
      blueprint.materials.push({ name: 'Musk Ketone', concentration: '25%' });
    }

    if (phase2.emotions.includes("Reassurance & Comfort")) blueprint.telemetry.calmAlpha += 20;
    if (phase2.claim === "Anxiety & Stress Reduction") blueprint.telemetry.calmAlpha += 22;

    const lifecycle = phase3.lifecycle || 3;
    blueprint.volatility.topNotes = 100 - (lifecycle * 15);
    blueprint.volatility.baseNotes = (lifecycle * 15);

    // DATABASE STORAGE (Transaction)
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // 1. Create product_brief
      const briefRes = await client.query(
        'INSERT INTO product_brief (user_id, status) VALUES ($1, $2) RETURNING brief_id',
        [user_id, 'Completed']
      );
      const brief_id = briefRes.rows[0].brief_id;
      blueprint.refId = `REF-${brief_id.toString().padStart(4, '0')}`; // Override refId to match DB

      // 2. Insert into intake_questionnaire_response
      const qaInserts = [
        [brief_id, 'Q-BR-001', 'Product Vehicle', phase1.vehicle],
        [brief_id, 'Q-BR-002', 'Target Demographic (Age)', phase1.demographicAge],
        [brief_id, 'Q-BR-003', 'Target Demographic (Gender)', phase1.demographicGender],
        [brief_id, 'Q-BR-004', 'Target Demographic (Geo)', phase1.demographicGeo],
        [brief_id, 'Q-BR-005', 'Retail Price Tier', phase1.priceTier],
        [brief_id, 'Q-SE-004', 'Base Note Preference', phase3.baseNotePreference]
      ];
      
      if (phase2.clinical === 'yes' && phase2.clinicalDetails) {
        qaInserts.push([brief_id, 'Q-NM-003', 'Clinical Documentation Requirements', phase2.clinicalDetails]);
      }

      for (const qa of qaInserts) {
        if (qa[3]) {
          await client.query(
            'INSERT INTO intake_questionnaire_response (brief_id, question_id, target_metric, response_value) VALUES ($1, $2, $3, $4)',
            qa
          );
        }
      }

      // 3. Insert volatility_matrix
      await client.query(
        'INSERT INTO volatility_matrix (brief_id, application_environment, sensory_lifecycle_goal, olfactive_restrictions) VALUES ($1, $2, $3, $4)',
        [brief_id, phase3.environment, phase3.lifecycle, phase3.restrictions]
      );

      // 4. Insert neuro_metric_objective
      await client.query(
        'INSERT INTO neuro_metric_objective (brief_id, primary_functional_claim, target_emotional_dimension, clinical_defense_required) VALUES ($1, $2, $3, $4)',
        [brief_id, phase2.claim, phase2.emotions.join(', '), phase2.clinical === 'yes']
      );

      // 5. Insert scent_formulation_blueprint
      await client.query(
        'INSERT INTO scent_formulation_blueprint (brief_id, neuro_metric_log, technical_spec_summary) VALUES ($1, $2, $3)',
        [brief_id, JSON.stringify(blueprint.telemetry), JSON.stringify(blueprint)]
      );

      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }

    res.json({
      status: 'success',
      blueprint
    });
  } catch (error) {
    console.error("Simulation error:", error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend simulation engine running on port ${PORT}`);
});
