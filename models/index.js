const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.SEQUELIZE_DB, process.env.SEQUELIZE_USERNAME, process.env.SEQUELIZE_PASSWORD, {
    host: process.env.SEQUELIZE_HOST,
    dialect: process.env.SEQUELIZE_DIALECT,
    operatorsAliases: false,
  
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },

  });
  

const models = {
    User: sequelize.import('./user'),
};

Object.keys(models).forEach((modelName) => {
    if ('associate' in models[modelName]) {
        models[modelName].associate(models);
    }
});

models.sequelize = sequelize;

module.exports =  models;

models.sequelize.sync({}).then(() => {});

//https://github.com/benawad/slack-clone-server/blob/2_sequelize/models/index.js
//https://www.youtube.com/watch?v=BpEw1PNdvkg