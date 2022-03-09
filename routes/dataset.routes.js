/*
  We have 5 APIs for keys route
  1. Get all dataset
  2. Get key info dataset
  3. Create new dataset
  4. Edit dataset
  5. Delete dataset 
*/

const router = require('express').Router();
var fs = require('fs');

// import multer for upload file to server
const multer = require('multer');
/* This is to upload file to server. */
const upload = multer({ dest: 'uploads/' });
const cpUpload = upload.single('dataset_image_upload');

//Use sequelize model
const db = require('../config/database.config');
const dataset_creator = db.dataset_creator;
const dataset = db.dataset;

//Get all dataset API
router.get('/', async (req, res) => {
  //Find and count all key of user in database
  const { count, rows } = await dataset.findAndCountAll({
    attributes: [
      'dataset_id',
      'dataset_img',
      'dataset_question',
      'dataset_reply',
    ],
  });

  //Check exist dataset
  if (!count) {
    return res.status(200).json({ 'message': 'Dataset does not exist' });
  }

/* This is to return data to client. */
  res.status(200).json({
    'message': 'get all dataset successfully',
    'data': rows,
  });
});

//Get dataset_id info API
router.get('/:dataset_id', async (req, res) => {
  const dataset_id = req.params.dataset_id;

  //Check null params
  if (!dataset_id) {
    return res.status(400).json({ 'message': 'dataset id is requried' });
  }

  //Find key in database
  const dataset_data = await dataset.findOne({
    attributes: [
      'dataset_id',
      'dataset_img',
      'dataset_question',
      'dataset_reply',
    ],
    where: {
      dataset_id: dataset_id,
    },
  });

  //Check exist key
  if (!dataset_data) {
    return res.status(400).json({ 'message': 'dataset does not exist' });
  }

/* This is to return data to client. */
  res.status(200).json({
    'message': 'get dataset successfully',
    'data': dataset_data,
  });
});

//Create new dataset API
router.post('/', cpUpload, async (req, res) => {
  //Validation
  if (
    !req.file ||
    !req.body.dataset_question ||
    !req.body.dataset_reply ||
    !req.body.admin_id
  ) {
    return res.status(404).json({ 'message': 'some fields is required' });
  }

/* This is checking file type. If file type is not valid, return 404. */
  if (
    req.file.mimetype !== 'image/jpeg' ||
    req.file.mimetype !== 'image/png' ||
    req.file.mimetype !== 'image/gif'
  ) {
    return res.status(404).json({ 'message': 'file type is not valid' });
  }

  const dataset_question = req.body.dataset_question;
  const dataset_reply = req.body.dataset_reply;
  const admin_id = req.body.admin_id;

/* This is to rename the file name. */
  const dataset_image_file =
    req.file.filename + '.' + req.file.originalname.split('.')[1];

  //Create dataset
  dataset_created = await dataset.create({
    dataset_img: dataset_image_file,
    dataset_question: dataset_question,
    dataset_reply: dataset_reply,
  });
  //Create_creator dataset
  await dataset_creator.create({
    dataset_id: dataset_created.dataset_id,
    admin_id: admin_id,
  });

/* This is to return message to client. */
  res.status(200).json({
    'message': 'create dataset successfully',
  });
/* This is to rename the file name. */
  const oldPath = 'uploads/' + req.file.filename;
  const newPath = process.env.DATASET_IMG_PATH + dataset_image_file;
  fs.rename(oldPath, newPath, function (err) {});
});

//Edit dataset API
router.patch('/:dataset_id', cpUpload, async (req, res) => {
  //Validation for upload file
  if (!req.file) {
    return res.status(404).json({ 'message': 'image file is required' });
  }

/* This is checking file type. If file type is not valid, return 404. */
  if (
    req.file.mimetype !== 'image/jpeg' ||
    req.file.mimetype !== 'image/png' ||
    req.file.mimetype !== 'image/gif'
  ) {
    return res.status(404).json({ 'message': 'file type is not valid' });
  }

  const dataset_id = req.params.dataset_id;
  const new_dataset_question = req.body.new_dataset_question;
  const new_dataset_reply = req.body.new_dataset_reply;
/* This is to rename the file name. */
  const dataset_image_file =
    req.file.filename + '.' + req.file.originalname.split('.')[1];

  //Find dataset_id in db
  const dataset_id_qeury = await dataset.findOne({
    where: {
      dataset_id: dataset_id,
    },
  });

  //Check exist dataset
  if (!dataset_id_qeury) {
    return res.status(400).json({ 'message': 'dataset does not exist' });
  }
  //Edit dataset
  try {
    await dataset.update(
      {
        dataset_img: dataset_image_file,
        dataset_question: new_dataset_question,
        dataset_reply: new_dataset_reply,
      },
      {
        where: {
          dataset_id: dataset_id,
        },
      }
    );
  } catch (err) {
    /* This is to return error message to client. */
    res.status(400).json({ 'message': 'error dataset cannot update' });
  }

/* This is to return message to client. */
  res.status(200).json({
    'message': 'edit dataset successfully',
  });

  //Delete temp image file and move to process.env.DATASET_IMG_PATH
  const oldPath = 'uploads/' + req.file.filename;
  const newPath = process.env.DATASET_IMG_PATH + dataset_image_file;
  fs.rename(oldPath, newPath, function (err) {});
});

//Delete key API
router.delete('/:dataset_id', async (req, res) => {
  const dataset_id = req.params.dataset_id;

  //Find dataset_id in database
  const dataset_id_qeury = await dataset.findOne({
    where: {
      dataset_id: dataset_id,
    },
  });

  //Check exist key
  if (!dataset_id_qeury) {
    /* This is to return error message to client. */
    return res.status(400).json({ 'message': 'dataset_id does not exist' });
  }

  //Delete key
  await dataset.destroy({
    where: {
      dataset_id: dataset_id,
    },
  });

/* This is to return message to client. */
  res.status(200).json({
    'message': 'delete key successfully',
  });
});

module.exports = router;
