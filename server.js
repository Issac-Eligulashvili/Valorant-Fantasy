const express = require('express');
const axios = require('axios');
require('dotenv').config();
const path = require('path');
const app = express();
const PORT = 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/leagues', async (req, res) => {
     try {
          const response = await axios.get('https://api.pandascore.co/valorant/leagues?search[name]=VCT', {
               headers: {
                    Authorization: `Bearer ${process.env.PANDASCORE_API_KEY}`
               }
          })
          res.json(response.data);
     } catch (error) {
          res.status(500).json({ error: 'An error occurred' });
     }
})

// Redirect logic for "/join/*" paths
app.get('/join/*', (req, res) => {
     // Extract the data part after "/join/"
     const dataPart = req.params[0]; // Captures everything after "/join/"

     //craete timestamp to prevent cashing in browser
     const timestamp = Math.random();

     // Redirect to "join.html"
     res.redirect(`/join.html?uniqueID=${dataPart}&_=${timestamp}`);
});

// Start the server
app.listen(PORT, () => {
     console.log(`Server is running at http://localhost:${PORT}`);

});
