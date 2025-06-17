// 1. REQUIRE all necessary packages at the top
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

// 2. CREATE your Express application
const app = express();

// 3. USE your middleware
// This must come AFTER you create the app
app.use(cors());

// 4. SETUP the database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// 5. DEFINE your API routes (this is the part you still had)
app.get('/api/images', async (req, res) => {
  try {
    // This query fetches ONE random row from the images table
    const result = await pool.query('SELECT * FROM images ORDER BY RANDOM() LIMIT 1');
    
    if (result.rows.length === 0) {
      return res.status(404).send('No images found.');
    }
    
    // This is the key: send back just the single image object, not the whole array
    res.json(result.rows[0]); 

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// 6. START the server
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});