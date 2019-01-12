const express = require('express');
const router = express.Router();
const models = require('../../../models');
const auth = require('../../../middlewares/auth.middleware');

router.get('/info', auth.required, (req, res) => {

  console.log(req.userId);
  models.User
    .find({
      where: {
        id: req.userId
      },
      attributes: ['id', 'username', 'email']
    })
    .then((data) => {
      return res.json(data.dataValues)
    })
    .catch((error) => {
      return  res.sendStatus(404)
    })
 

})

module.exports = router;
