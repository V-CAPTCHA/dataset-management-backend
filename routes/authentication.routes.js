/*
  We have 4 APIs for authenaction route
  1. Login API
  2. Register API
  3. Request to reset password API
  4. Reset password API
*/

const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');


//Use sequelize model
const db = require('../config/database.config');
const Admin = db.admin;


//Login API
router.post('/login', 
  body('email').isEmail(),
  body('password').isLength({ min: 8, max: 50 }),
async (req, res) => {

  //Validation
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  //Check null value
  const email = req.body.email;
  const password = req.body.password;
  if (!(email && password))
    return res.status(400).json({ "message": "information is required" })


  //Check exist admin
  const admin = await Admin.findOne({ where: { email: email }});
  if (!admin)
    return res.status(400).json({"message": "admin does not exist "})

  //Compare password
  const isMatch = await bcrypt.compare(password, admin.password);

  //Correct password
  if(isMatch) {
    const token = jwt.sign(
      { admin_id: admin.admin_id },  //payload
      process.env.SECRET_KEY,        //secret key
      { expiresIn: "1d" }            //expired
    );

    res.status(200).json({
      "message": "authorization successfully",
      "token": token,
    });
  }

  //Incorrect password
  else {
    res.status(401).json({"message": "incorrect password"});
  }
})


module.exports = router;