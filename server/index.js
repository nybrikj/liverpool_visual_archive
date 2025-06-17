// 1. REQUIRE all necessary packages at the top
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

// 2. CREATE your Express application
const app = express();

// 3. USE your middleware (app.use)
// This must come AFTER you create the app
app.use(cors());

// Setup the database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// 4. DEFINE your API routes
app.get('/api/images', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM images');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// 5. START the server
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});