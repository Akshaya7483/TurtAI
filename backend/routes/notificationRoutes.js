const express = require('express');
const router = express.Router();
const { toggleNotification } = require('../controllers/notificationController');

router.post('/toggle', toggleNotification);

module.exports = router;
