const { Pool } = require('pg')
const pool = new Pool({
  user: 'nrodgers',
  host: 'localhost',
  database: 'nrodgers',
  password: 'lazercatz',
  port: 5432
})

module.exports = pool;
