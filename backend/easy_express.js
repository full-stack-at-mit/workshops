const express = require('express');
const cors = require('cors');

const app = express();

// Setup CORS
app.use(cors());
app.use(express.json());

app.post('/chat', (req, res) => {
    try {
        // Get text from request
        const userMessage = req.body.text;

        if (!userMessage) {
            return res.status(400).json({ error: 'No text provided' });
        }

        // Return the response
        return res.status(200).json({ response: 'Response received!' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
