const express = require('express');
const router = express.Router();

router.use(require('./authentication'));
router.use(require('./account'));

module.exports = router;