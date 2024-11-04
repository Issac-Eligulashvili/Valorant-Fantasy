const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

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
