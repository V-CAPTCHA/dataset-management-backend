/*
  We have 5 APIs for keys route
  1. Get all dataset
  2. Get key info dataset
  3. Create new dataset
  4. Edit dataset
  5. Delete dataset 
*/

const router = require('express').Router();
const { nanoid } = require('nanoid');
const moment = require('moment');
const { body, validationResult } = require('express-validator');


//Use sequelize model
const db = require('../config/database.config');
const dataset = db.dataset;
const AuthenAction = db.authen_action;


//Get all dataset API
router.get('/', async (req, res) => {
  //Find and count all key of user in database
  const {count, rows} = await dataset.findAndCountAll({
    attributes: [
      'dataset_id',
      'dataset_img',
      'dataset_question',
      'dataset_reply',
    ]
  });

  //Check exist dataset
  if(!count) {
    return res.status(200).json({"message": "Dataset does not exist"});
  }
  
  res.status(200).json({
    "message": "get all dataset successfully",
    "data": rows
  })
});



module.exports = router;