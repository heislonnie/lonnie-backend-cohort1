const express = require('express');
const router = express.Router();
const axios = require('axios');
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});

router.get('/weather', limiter, async (req, res) => {
    try {
        const response = await axios.get(`https://api.weatherapi.com/v1/current.json`, {
            params: {
                key: process.env.WEATHER_API_KEY,
                q: 'London'
            }
        });

        const { temp_c, condition, humidity } = response.data.current;
        
        res.json({
            temperature: temp_c,
            weather: condition.text,
            humidity
        });
    } catch (error) {
        res.status(500).json({ error: 'Weather service unavailable' });
    }
});

module.exports = router;