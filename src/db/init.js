// src/db/init.js
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
});

const initDB = async () => {
    try {
        await pool.query('CREATE EXTENSION IF NOT EXISTS postgis;');
        console.log('PostGIS extension enabled.');
    } catch (err) {
        console.error('Error initializing the database:', err);
    } finally {
        pool.end();
    }
};

initDB();
