const Sequelize = require('sequelize');

//Setup Sequelize
const sequelize = new Sequelize(
  //Connect database
  process.env.DB_DATABASE, 
  process.env.DB_USER, 
  process.env.DB_PASSWORD, 
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
    operatorsAliases: 0,
    pool: {
      max: 5,
      min: 5,
      acquire: 30000,
      idle: 10000,
    }
  }
);


//Use sequelize
const db = {};
db.Sequelize = Sequelize; //use sequelize
db.sequelize = sequelize; //connect database


//Setup models
db.captcha_key = require('../models/captcha_key')(sequelize, Sequelize);
db.authen_action = require('../models/authen_action')(sequelize, Sequelize);
db.admin = require('../models/admin')(sequelize, Sequelize);
db.dataset_creator = require('../models/dataset_creator')(sequelize, Sequelize);
db.dataset = require('../models/dataset')(sequelize, Sequelize);
db.user = require('../models/user')(sequelize, Sequelize);

//Association
//Define association of CaptchaKey and AuthenAction
db.captcha_key.hasMany(db.authen_action, { foreignKey: 'key_value' });
db.authen_action.belongsTo(db.captcha_key, { foreignKey: 'key_value', targetKey: 'key_value' });

module.exports = db;