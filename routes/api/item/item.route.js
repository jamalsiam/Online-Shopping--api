const express = require('express');
const router = express.Router();
const models = require('../../../models');
const auth = require('../../../middlewares/auth.middleware');
const fs = require('./../../../common/fs');
var multer = require("multer");

var storage = multer.diskStorage(
  {
    destination: function (req, file, next) {
      fs.makeDirctionFolder(req.userId, 'items', (dir) => {
        next(null, dir)
      })
    },
    filename: function (req, file, cb) {
      const fileName = Date.now() + ".png"
      req.body.imagesList = { ...req.body.imagesList }
      req.body.imagesList[fileName] = fileName;

      cb(null, fileName);
    }
  }
);

var upload = multer({ storage: storage }).array("uploads", 12);

router.get('/list', (req, res) => {
  models.Item.findAll({
    limit: 40,
    order: [
      ['id', 'DESC'],
    ],
    include: [{
      model: models.User,
      as: 'user',
      attributes: ['username', 'id']
    }],
    attributes: ['category', 'createdAt', 'discount', 'id', 'images', 'name', 'new', 'price']
  })
    .then((data) => {
      data.map((item) => { item.images = `${process.env.BACK_END_URL}/${item.user.id}/items/${item.images[0]}` })
      res.json(data)
    })

})

router.get('/:id', (req, res) => {
  console.log('Under Development');
})

router.post('/', auth.required, upload, (req, res) => {
  const imagesList = Object.values(req.body.imagesList)
  const { name, category, price, discount, isNew, description } = JSON.parse(req.body.data)
  const { userId } = req;

  if (!name && !category && !price && !description) {
    return res.sendStatus(422);
  }

  models.Item
    .create({ user_id: userId, name, category, images: imagesList, price, discount, description, new: isNew })
    .then((item) => {
      return res.json(item.dataValues);
    })
    .catch((error) => {
      return res.sendStatus(422);
    })

})


module.exports = router;
