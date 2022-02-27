const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');
const { body, validationResult } = require('express-validator');
const { nanoid } = require('nanoid');


//Use sequelize model
const db = require('../config/database.config');
const Admin = db.admin;


//Mailer
const transporter = require('../config/mailer.config');


//Get all admin information API
router.get('/all', async(req, res) => {
  //Check admin role
  const creator_id = res.locals.admin.admin_id;
  const creator = await Admin.findOne({ where: { admin_id: creator_id }});
  if (creator.role !== "super" || !creator)
    return res.status(400).json({ "message": "Only super admin can get admin information" })

  //Find and count all admin in database
  const {count, rows} = await Admin.findAndCountAll({
    attributes: [
      'admin_id',
      'email',
      'first_name',
      'last_name'
    ],
    where: {
      role: {
        [Sequelize.Op.not]: 'super'
      }
    }
  })

  //Check exist admin
  if(!count) {
    return res.status(200).json({"message": "admin does not exist"});
  }
  
  res.status(200).json({
    "message": "get all admin successfully",
    "data": rows
  })
})


//Get admin information by id API
router.get('/', async(req, res) => {
  const admin_id = res.locals.admin.admin_id;

  //Find an admin in database
  const admin = await Admin.findOne({
    attributes: [
      'admin_id',
      'email',
      'first_name',
      'last_name',
    ],
    where: { 
      admin_id: admin_id,
    }
  });

  //Check exist admin
  if(!admin) {
    return res.status(400).json({"message": "admin does not exist"});
  }

  res.status(200).json({
    "message": "get admin successfully",
    "data": admin
  });
})


//Create admin API
router.post('/', 
  body('email').isEmail(), 
  body('first_name').isLength({ min: 2, max: 50 }),
  body('last_name').isLength({ min: 2, max: 50 }),
async (req, res) => {
  //Validation
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  //Check admin role
  const creator_id = res.locals.admin.admin_id;
  const creator = await Admin.findOne({ where: { admin_id: creator_id }});
  if (creator.role !== "super" || !creator)
    return res.status(400).json({ "message": "Only super admin can create admin" })
  
  const email = req.body.email;
  const password = nanoid();
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;

  //Check null information
  if (!(email && password && first_name && last_name)) 
    return res.status(400).json({ "message": "information is required" })

  //Check exist admin email
  const user = await Admin.findOne({ where: { email: email }});
  if (user) return res.status(400).json({
    "message": "admin email already exists"
  });

  //Hashing password
  const hashPassword = await bcrypt.hash(password, 8);

  //Create admin
  await Admin.create({
    email: email,
    password: hashPassword,
    first_name: first_name,
    last_name: last_name,
    role: 'admin',
  });

  //Send password to admin email
  const mail = await transporter.sendMail({
    from: '"VCaptcha" <vcaptcha.work@gmail.com>',
    to: email,
    subject: 'รหัสผ่านสำหรับ Admin ของ VCaptcha',
    text: "ดูเหมือนว่าคุณได้รหัสผ่านสำหรับเข้าใช้งานระบบ Admin",
    html: `
      <h3>สวัสดี, ${first_name} ${last_name}!</h3>
      <p>ดูเหมือนว่าคุณได้รหัสผ่านสำหรับเข้าใช้งานระบบ Admin ของ VCaptcha</p>
      <p>ใช้อีเมล์และรหัสผ่านนี้เพื่อเข้าสู่ระบบ Admin ของ VCaptcha</p>
      <p><b>${password}</b></p>
    `
  }).catch((error) => {
    console.log(error);
  })

  res.status(200).json({
    "message": "create admin successfully",
  });
})


module.exports = router;