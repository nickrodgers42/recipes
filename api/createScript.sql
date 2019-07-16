BEGIN TRANSACTION;
DROP TABLE ingredients, directions, recipes, users;
DROP EXTENSION IF EXISTS pg_trgm;

CREATE EXTENSION pg_trgm;

CREATE TABLE IF NOT EXISTS users (
  id      BIGSERIAL PRIMARY KEY,
  name    VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS recipes (
  id      SERIAL PRIMARY KEY,
  name    VARCHAR(100) NOT NULL,
  created_by_id  BIGINT REFERENCES users (id) NOT NULL,
  creation_date TIMESTAMP NOT NULL,
  source  VARCHAR(250)
);

CREATE TABLE IF NOT EXISTS ingredients (
  id      SERIAL PRIMARY KEY,
  value   VARCHAR(250) NOT NULL,
  position   INTEGER NOT NULL,
  recipe_id INTEGER REFERENCES recipes (id)
);

CREATE TABLE IF NOT EXISTS directions (
  id      SERIAL PRIMARY KEY,
  value   TEXT NOT NULL,
  position   INTEGER NOT NULL,
  recipe_id INTEGER REFERENCES  recipes (id)
);

COMMIT;
