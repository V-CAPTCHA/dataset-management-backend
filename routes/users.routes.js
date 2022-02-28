const router = require('express').Router();
const bcrypt = require('bcrypt');
const { body, param, validationResult } = require('express-validator');


//Use sequelize model
const db = require('../config/database.config');
const User = db.user;
const Admin = db.admin;


//Get all user API
router.get('/', async (req, res) => {
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


//Change user information API
router.patch('/:user_id', 
  param('user_id').isInt(),
  body('email').isEmail(),
  body('first_name').isLength({ min: 2, max: 50 }),
  body('last_name').isLength({ min: 2, max: 50 }),
async(req, res) => {
  //Validation
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const user_id = req.params.user_id;
  const email = req.body.email
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;

  //Check null information
  if (!(email && first_name && last_name)) 
    return res.status(400).json({ "message": "information is required" })

  //Find user in db
  const user = await User.findOne({ 
    where: { user_id: user_id }
  });

  //Check exist user
  if (!user)
    return res.status(400).json({"message": "user does not exist "});


  //Update user
  await User.update(
    {  
      email: email,
      first_name: first_name,
      last_name: last_name,
    },
    { where: { user_id: user_id }}
  );

  res.status(200).json({
    "message": "change user information successfully"
  })
})


//Activate and Deactivate user API
router.put('/status/:user_id', 
  param('user_id').isInt(),
async(req, res) => {
  const user_id = req.params.user_id;

  //Find user in database
  const user = await User.findOne({ 
    where: { user_id: user_id }
  });

  //Check exist user
  if(!user) {
    return res.status(400).json({"message": "user does not exist"});
  }

  //Check old state
  let oldEmail = user.email;
  let isActivate = oldEmail.split('::').length === 1;

  //Change to deactivate
  if(isActivate) {
    const newEmail = user.email + "::deactivate";

    await User.update({
      email: newEmail
    },
    { where: { user_id: user_id }})
  
    res.status(200).json({
      "message": "user has deactivated"
    });
  }

  //Change to activate
  else {
    const newEmail = oldEmail.split('::')[0];

    await User.update({
      email: newEmail
    },
    { where: { user_id: user_id }})
  
    res.status(200).json({
      "message": "user has activate"
    });
  }
})


module.exports = router;