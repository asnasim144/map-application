// server.js
require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');
const { Pool } = require('pg');
const axios = require('axios');
const path = require('path');
const app = express();
const port = 3000;

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// PostgreSQL connection
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
});

// Serve static files (Leaflet map)
app.use(express.static(path.join(__dirname, 'public')));

// Geocoding route
app.get('/geocode', async (req, res) => {
    const { q } = req.query;
    try {
        const response = await axios.get(`${process.env.NOMINATIM_URL}/search`, {
            params: { q, format: 'json' }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).send('Error in geocoding.');
    }
});

// Routing route
app.get('/route', async (req, res) => {
    const { start, end } = req.query;
    try {
        const response = await axios.get(`${process.env.OSRM_URL}/route/v1/driving/${start};${end}`, {
            params: { overview: 'full', geometries: 'geojson' }
        });
        
        console.log("🚀 ~ file: server.js:50 ~ app.get ~ response:", response);
        res.json(response.data);
    } catch (error) {

        console.log("🚀 ~ file: server.js:53 ~ app.get ~ error:", error);
        res.status(500).send({message: 'Error in routing.'});
    }
});

app.listen(port, () => {
    console.log(`App running on port ${port}.`);
});
