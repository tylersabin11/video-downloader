const express = require('express');
const router = express.Router();
const { fetchVideo } = require('../controllers/videoController');
const { downloadVideo } = require('../controllers/downloadController');

router.post('/fetch', fetchVideo);
router.get('/download', downloadVideo);

module.exports = router;
