const { Pool } = require('pg')

require('dotenv').config(options = {
    path: '.env'
});

const DB_USER = process.env.DB_USER
const DB_HOST = process.env.DB_HOST
const DB_DATABASE = process.env.DB_DATABASE
const DB_PORT = process.env.DB_PORT

const pool = new Pool({
    user: DB_USER,
    host: DB_HOST,
    database: DB_DATABASE,
    port: DB_PORT,
})

exports.query = (text, params, callback) => {
  return pool.query(text, params, callback);
};