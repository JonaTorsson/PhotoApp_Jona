const express = require('express');
const router = express.Router();
const userValidationRules = require('../validation/user');
const auth = require('../middlewares/auth');
const authController = require ('../controllers/auth_controller');

/* GET / */
router.get('/', (req, res, next) => {
	res.send({ success: true, data: { msg: 'Welcome to my first app, PhotoApp' }});
});

/**
 * Register a new user
 */
router.post('/register', userValidationRules.createRules, authController.register);

/**
 * Login
 */
router.post('/login', authController.login);

/**
 * router links to models
 * 
 */
router.use(auth.validateJwtToken);
router.use('/albums', require('./album_route'));
router.use('/photos', require('./photo_route'));

module.exports = router;
