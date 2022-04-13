
 const { body } = require('express-validator');
 const models = require('../models');
 
 /**
  * Rules for adding a new photo
  * 
  * POST /photos
  */
 const createRules = [
     body('title').exists().isString().isLength({ min: 3 }).custom(async value => {
         const title = await new models.photo_model({ title: value }).fetch({ require: false });
         if (title) {
             return Promise.reject('Title already exists.');
         }
         return Promise.resolve();
     }),
     body('url').exists().isURL().isString(),
     body('comment').optional().isString().isLength({ min: 3 }),
 ];

 /**
  * Rules for update a photo
  * 
  * PUT /photos/:photoid
  */
 
 const updateRules = [
     body('title').optional().isString().isLength({ min: 3 }),
     body('url').optional().isURL().isString(),
     body('comment').optional().isString().isLength({ min: 3 }),
 ];
 
 module.exports = {
     createRules,
     updateRules,
 }
 