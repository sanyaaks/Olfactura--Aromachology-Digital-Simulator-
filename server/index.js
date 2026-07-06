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
  
  // Strict password validation (for new account creation only)
  const pwRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{6,}$/;
  if (!password || !pwRegex.test(password)) {
    return res.status(400).json({
      error: 'Password must be at least 6 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character.'
    });
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

// Get user profile endpoint
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.user_id, u.name, u.email, u.role, c.company_name, c.market_tier 
       FROM users u
       LEFT JOIN company c ON u.company_id = c.company_id
       WHERE u.user_id = $1`,
      [req.user.user_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ status: 'success', user: result.rows[0] });
  } catch (error) {
    console.error("Get user profile error:", error);
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

    if (phase1.vehicle === 'Roll-On/Pulse-Point Oil' && phase2.claim === 'Anxiety & Stress Reduction') {
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
        [user_id, 'Analysis']
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

// Get user briefs endpoint
app.get('/api/briefs', authenticateToken, async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const briefsResult = await pool.query(
      `SELECT pb.brief_id, pb.status, pb.created_at, pb.updated_at, sf.technical_spec_summary
       FROM product_brief pb
       LEFT JOIN scent_formulation_blueprint sf ON pb.brief_id = sf.brief_id
       WHERE pb.user_id = $1
       ORDER BY pb.created_at DESC`,
      [user_id]
    );

    if (briefsResult.rows.length === 0) {
      return res.json({ status: 'success', briefs: [] });
    }

    const briefIds = briefsResult.rows.map(b => b.brief_id);

    const qasResult = await pool.query(
      `SELECT brief_id, question_id, target_metric, response_value 
       FROM intake_questionnaire_response 
       WHERE brief_id = ANY($1)`,
      [briefIds]
    );

    const vmsResult = await pool.query(
      `SELECT brief_id, application_environment, sensory_lifecycle_goal, olfactive_restrictions 
       FROM volatility_matrix 
       WHERE brief_id = ANY($1)`,
      [briefIds]
    );

    const nmsResult = await pool.query(
      `SELECT brief_id, primary_functional_claim, target_emotional_dimension, clinical_defense_required 
       FROM neuro_metric_objective 
       WHERE brief_id = ANY($1)`,
      [briefIds]
    );

    // Group data by brief_id
    const qasMap = {};
    qasResult.rows.forEach(r => {
      if (!qasMap[r.brief_id]) qasMap[r.brief_id] = {};
      if (r.question_id === 'Q-BR-001') qasMap[r.brief_id].vehicle = r.response_value;
      if (r.question_id === 'Q-BR-002') qasMap[r.brief_id].demographicAge = r.response_value;
      if (r.question_id === 'Q-BR-003') qasMap[r.brief_id].demographicGender = r.response_value;
      if (r.question_id === 'Q-BR-004') qasMap[r.brief_id].demographicGeo = r.response_value;
      if (r.question_id === 'Q-BR-005') qasMap[r.brief_id].priceTier = r.response_value;
      if (r.question_id === 'Q-SE-004') qasMap[r.brief_id].baseNotePreference = r.response_value;
      if (r.question_id === 'Q-NM-003') {
        qasMap[r.brief_id].clinical = 'yes';
        qasMap[r.brief_id].clinicalDetails = r.response_value;
      }
    });

    const vmsMap = {};
    vmsResult.rows.forEach(r => {
      vmsMap[r.brief_id] = {
        environment: r.application_environment,
        lifecycle: r.sensory_lifecycle_goal,
        restrictions: r.olfactive_restrictions
      };
    });

    const nmsMap = {};
    nmsResult.rows.forEach(r => {
      nmsMap[r.brief_id] = {
        claim: r.primary_functional_claim,
        emotions: r.target_emotional_dimension ? r.target_emotional_dimension.split(', ') : [],
        clinical: r.clinical_defense_required ? 'yes' : 'no'
      };
    });

    const briefs = [];
    for (const b of briefsResult.rows) {
      const elapsed = (new Date().getTime() - new Date(b.created_at).getTime()) / 1000;
      let computedStatus = 'Analysis';
      if (elapsed >= 55) {
        computedStatus = 'Ready';
      } else if (elapsed >= 35) {
        computedStatus = 'Review';
      } else if (elapsed >= 15) {
        computedStatus = 'Formulating';
      }

      if (b.status !== computedStatus) {
        await pool.query('UPDATE product_brief SET status = $1 WHERE brief_id = $2', [computedStatus, b.brief_id]);
        b.status = computedStatus;
      }

      const qas = qasMap[b.brief_id] || {};
      const vm = vmsMap[b.brief_id] || {};
      const nm = nmsMap[b.brief_id] || {};

      const responses = {
        vehicle: qas.vehicle || '',
        vehicleOther: '',
        demographicAge: qas.demographicAge || '',
        demographicAgeOther: '',
        demographicGender: qas.demographicGender || '',
        demographicGenderOther: '',
        demographicGeo: qas.demographicGeo || '',
        demographicGeoOther: '',
        priceTier: qas.priceTier || '',
        priceTierOther: '',
        claim: nm.claim || '',
        claimOther: '',
        emotions: nm.emotions || [],
        emotionsOther: '',
        clinical: nm.clinical || qas.clinical || 'no',
        clinicalDetails: qas.clinicalDetails || '',
        environment: vm.environment || '',
        environmentOther: '',
        lifecycle: vm.lifecycle || 3,
        restrictions: vm.restrictions || '',
        baseNotePreference: qas.baseNotePreference || '',
        baseNotePreferenceOther: ''
      };

      briefs.push({
        brief_id: b.brief_id,
        status: b.status,
        created_at: b.created_at,
        updated_at: b.updated_at,
        technical_spec_summary: b.technical_spec_summary,
        responses
      });
    }

    res.json({ status: 'success', briefs });
  } catch (error) {
    console.error("Get briefs error:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Middleware for optional JWT auth (used in support queries and feedback)
const optionalAuthenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    req.user = null;
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      req.user = null;
    } else {
      req.user = user;
    }
    next();
  });
};

// Submit Technical Query Endpoint
app.post('/api/support/query', optionalAuthenticateToken, async (req, res) => {
  const { name, email, subject, urgency, description } = req.body;
  const user_id = req.user ? req.user.user_id : null;
  try {
    await pool.query(
      'INSERT INTO support_query (user_id, name, email, subject, urgency, description) VALUES ($1, $2, $3, $4, $5, $6)',
      [user_id, name, email, subject, urgency, description]
    );
    res.json({ status: 'success', message: 'Technical query submitted successfully' });
  } catch (error) {
    console.error("Submit query error:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Open Feedback Portal Endpoint
app.post('/api/support/feedback', optionalAuthenticateToken, async (req, res) => {
  const { name, email, experience_rating, accuracy_rating, details } = req.body;
  const user_id = req.user ? req.user.user_id : null;
  try {
    await pool.query(
      'INSERT INTO client_feedback (user_id, name, email, experience_rating, accuracy_rating, details) VALUES ($1, $2, $3, $4, $5, $6)',
      [user_id, name, email, parseInt(experience_rating, 10), parseInt(accuracy_rating, 10), details]
    );
    res.json({ status: 'success', message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error("Submit feedback error:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend simulation engine running on port ${PORT}`);
});
