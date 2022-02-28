const router = require('express').Router();
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');


//Use sequelize model
const db = require('../config/database.config');
const User = db.user;
const Admin = db.admin;


//Get all user API
router.get('/all', async (req, res) => {
  //Find and count all key of user in database
  const {count, rows} = await User.findAndCountAll({
    attributes: [
      'user_id',
      'email',
      'first_name',
      'last_name',
    ],
  });

  //Check exist key
  if(!count) {
    return res.status(200).json({"message": "user does not exist"});
  }

  res.status(200).json({
    "message": "get all users successfully",
    "data": rows
  })
})


//Get a user API
router.get('/:user_id', async(req, res) => {
  const user_id = req.params.user_id;

  //Find a user in database
  const user = await User.findOne({
    attributes: [
      'user_id',
      'email',
      'first_name',
      'last_name',
    ],
    where: {
      user_id: user_id
    }
  })

  //Check exist user
  if(!user) {
    return res.status(400).json({"message": "user does not exist"});
  }

  res.status(200).json({
    "message": "get user successfully",
    "data": user
  });
})

module.exports = router;