/**
 * User Validation
 */

 const { body } = require('express-validator');
 const models = require('../models');
 
 const createRules = [
     body('email').exists().isEmail().isString().custom(async value => {
         const user = await new models.user_model({ email: value }).fetch({ require: false });
         if (user) {
             return Promise.reject("Email already exists.");
         }
 
         return Promise.resolve();
     }),
     body('password').exists().isString().isLength({ min: 4 }),
     body('first_name').exists().isString().isLength({ min: 2 }),
     body('last_name').exists().isString().isLength({ min: 2 }),
 ];

 module.exports = {
    createRules,
}