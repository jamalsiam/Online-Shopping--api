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
    .catch(() => {
      res.json([])
    })

})


router.get('/accountList', auth.required, (req, res) => {

  models.Item.findAll({
    where: {
      user_id: req.userId
    },
    order: [
      ['id', 'DESC'],
    ],
    attributes: ['category', 'createdAt', 'discount', 'id', 'images', 'name', 'new', 'price', 'user_id']
  })
    .then((data) => {
      data.map((item) => { item.images = `${process.env.BACK_END_URL}/${item.user_id}/items/${item.images[0]}` })
      res.json(data)
    })
    .catch((a) => {
      console.log(a);

      res.json([])
    })

})

router.get('/:id', (req, res) => {
  models.Item.find({
    where: {
      id: req.params.id
    },
    include: [{
      model: models.User,
      as: 'user',
      attributes: ['username', 'id']
    }],
  })
    .then(({ dataValues }) => {
      dataValues.images.map((image, i) => { dataValues.images[i] = `${process.env.BACK_END_URL}/${dataValues.user.id}/items/${image}` })
      res.json(dataValues)
    })
    .catch(() => {
      res.sendStatus(404)
    })
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

router.delete('/delete/:itemId', auth.required, (req, res) => {
  
  models.Item.
  destroy({
    where: {
      id:req.params.itemId,
      user_id:req.userId
    }
  })
  .then(()=>{
    res.sendStatus(200)
  })
  .catch(()=>{
    res.sendStatus(404)
  })

})

module.exports = router;
