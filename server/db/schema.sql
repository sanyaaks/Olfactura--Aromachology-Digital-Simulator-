-- Drop existing tables to allow clean initialization
DROP TABLE IF EXISTS metamood_data_mapping CASCADE;
DROP TABLE IF EXISTS blueprint_ingredient_link CASCADE;
DROP TABLE IF EXISTS scent_formulation_blueprint CASCADE;
DROP TABLE IF EXISTS neuro_metric_objective CASCADE;
DROP TABLE IF EXISTS volatility_matrix CASCADE;
DROP TABLE IF EXISTS intake_questionnaire_response CASCADE;
DROP TABLE IF EXISTS product_brief CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS company CASCADE;
DROP TABLE IF EXISTS ingredient CASCADE;

CREATE TABLE company (
  company_id SERIAL PRIMARY KEY,
  company_name VARCHAR(255) NOT NULL,
  market_tier VARCHAR(100)
);

CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  company_id INT REFERENCES company(company_id),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(100),
  password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE product_brief (
  brief_id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(user_id),
  status VARCHAR(50) DEFAULT 'Draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE intake_questionnaire_response (
  response_id SERIAL PRIMARY KEY,
  brief_id INT REFERENCES product_brief(brief_id),
  question_id VARCHAR(50),
  target_metric VARCHAR(255),
  response_value TEXT
);

CREATE TABLE volatility_matrix (
  matrix_id SERIAL PRIMARY KEY,
  brief_id INT REFERENCES product_brief(brief_id) UNIQUE,
  application_environment VARCHAR(255),
  sensory_lifecycle_goal INT,
  olfactive_restrictions TEXT
);

CREATE TABLE neuro_metric_objective (
  objective_id SERIAL PRIMARY KEY,
  brief_id INT REFERENCES product_brief(brief_id) UNIQUE,
  primary_functional_claim VARCHAR(255),
  target_emotional_dimension TEXT,
  clinical_defense_required BOOLEAN
);

CREATE TABLE scent_formulation_blueprint (
  blueprint_id SERIAL PRIMARY KEY,
  brief_id INT REFERENCES product_brief(brief_id) UNIQUE,
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  neuro_metric_log JSONB,
  technical_spec_summary JSONB
);

CREATE TABLE ingredient (
  ingredient_id SERIAL PRIMARY KEY,
  ingredient_name VARCHAR(255) NOT NULL,
  molecular_classification VARCHAR(100),
  average_molecular_weight FLOAT,
  is_lmr_natural BOOLEAN
);

CREATE TABLE blueprint_ingredient_link (
  blueprint_id INT REFERENCES scent_formulation_blueprint(blueprint_id),
  ingredient_id INT REFERENCES ingredient(ingredient_id),
  molecular_weight_guideline FLOAT,
  formulation_role VARCHAR(255),
  PRIMARY KEY (blueprint_id, ingredient_id)
);

CREATE TABLE metamood_data_mapping (
  mapping_id SERIAL PRIMARY KEY,
  emotional_dimension VARCHAR(255),
  ingredient_id INT REFERENCES ingredient(ingredient_id),
  alpha_wave_boost_projection FLOAT,
  hrs_stabilization_projection FLOAT
);

-- Insert some dummy ingredients for the simulation
INSERT INTO ingredient (ingredient_name, molecular_classification, average_molecular_weight, is_lmr_natural) VALUES 
('Lavandin Heart', 'Top', 154.25, TRUE),
('Tonka Bean Absolute', 'Base', 204.22, TRUE),
('Linalool (Standard)', 'Heart', 154.25, FALSE),
('Musk Ketone', 'Base', 294.3, FALSE);
