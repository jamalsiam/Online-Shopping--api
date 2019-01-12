const express = require('express');
const router = express.Router();
const passport = require('passport');
const models = require('../../../models');
const auth = require('../../../middlewares/auth.middleware');
const refreshToken = require('../../../middlewares/refreshToken.middleware');
const jwt = require('../../../common/jwt');
const redis = require('../../../common/redis');


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
