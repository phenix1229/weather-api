const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/authController');

router.get('/auth/findWeather', weatherController.findWeather);
router.get('/auth/weatherQuery', weatherController.weatherQuery);
router.get('/auth/weather', weatherController.weather);

module.exports = router;