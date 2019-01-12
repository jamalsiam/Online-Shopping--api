
const express = require('express');
const router = express.Router();

router.use('/item', require('./item.route'));

module.exports = router;