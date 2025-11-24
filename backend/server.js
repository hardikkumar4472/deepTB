const express = require('express');
const app = express();
const PORT = 5000;
const ML_API_URL = process.env.ML_API_URL || 'http://localhost:8000';

app.get('/', (req, res) => {
    res.send('TB Detection Backend Service Running.');
});

app.get('/test-ml-connection', async (req, res) => {
    try {
        res.status(200).json({
            status: 'ML API connection check initiated',
            target: ML_API_URL,
            message: 'Connection will be tested in Phase 4 during integration.'
        });
    } catch (error) {
        res.status(500).json({ error: 'Connection failed or ML API is not ready.' });
    }
});

app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}. ML API target: ${ML_API_URL}`);
});