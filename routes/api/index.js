const express = require('express');
const router = express.Router();

router.use(require('./authentication'));
router.use(require('./account'));
router.use(require('./item'));

module.exports = router;