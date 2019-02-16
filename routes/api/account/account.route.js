const express = require('express');
const router = express.Router();
const models = require('../../../models');
const auth = require('../../../middlewares/auth.middleware');
const fs = require('./../../../common/fs');
var multer = require("multer");

var storage = multer.diskStorage(
  {
    destination: function (req, file, next) {
      fs.makeDirctionFolder(req.userId, '', (dir) => {
        next(null, dir)
      })
    },
    filename: function (req, file, cb) {
      const fileName = Date.now() + ".png";
      req.body.imageName = fileName;

      cb(null, fileName);
    }
  }
);

var upload = multer({ storage: storage }).array("uploads", 1);

router.get('/info', auth.required, (req, res) => {

  console.log(req.userId);
  models.User
    .find({
      where: {
        id: req.userId
      },
      attributes: ['id', 'username', 'email', 'picture', 'phoneNumber']
    })
    .then(({ dataValues }) => {
      if (dataValues.picture) {
        dataValues.picture = `${process.env.BACK_END_URL}/${dataValues.id}/${dataValues.picture}`
      } else {
        dataValues.picture = `${process.env.BACK_END_URL}/user.jpeg`
      }

      return res.json(dataValues)
    })
    .catch((error) => {
      return res.sendStatus(404)
    })
})

router.put('/info', auth.required, (req, res) => {
  const { username, phoneNumber } = req.body;
  models.User.update({
    username,
    phoneNumber
  },
    { where: { id: req.userId } })
    .then(result => {
      res.json()
    })
    .catch(err => {
      res.sendStatus(401)
    })
})

router.put('/image', auth.required, upload, (req, res) => {
  const { imageName } = req.body;

  models.User.update({
    picture: imageName,

  },
    { where: { id: req.userId } })
    .then(result => {
      res.json({ imageURL: `${process.env.BACK_END_URL}/${req.userId}/${imageName}` })
    })
    .catch(err => {
      res.sendStatus(401)
    })
})


module.exports = router;
