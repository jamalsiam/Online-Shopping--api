const express = require('express');
const router = express.Router();
const models = require('../../../models');
const auth = require('../../../middlewares/auth.middleware');


router.get('/list', (req, res) => {
  console.log('Under Development');
})

router.get('/:id', (req, res) => {
  console.log('Under Development');
})

router.post('/', auth.required, (req, res) => {
  console.log('Under Development');
})


module.exports = router;
