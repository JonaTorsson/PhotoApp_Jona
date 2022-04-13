const express = require('express');
const router = express.Router();
const photoController = require('../controllers/photo_controller');
const photoValidationRules = require('../validation/photo');

/**
 * Get all photos to the user who's logged in
 * 
 * GET /photos
 */
router.get('/', photoController.getPhotos);

/**
 * Get a specific photo
 * 
 * GET /photos/:photoId
 */
router.get('/:photoId', photoController.showPhoto);

/**
 * Add a photo
 * 
 * POST /photos
 */
router.post('/', photoValidationRules.createRules, photoController.addPhoto);

/**
 * Update a photo
 * 
 * PUT /photos/:photoId
 */
router.put('/:photoId', photoValidationRules.updateRules, photoController.updatePhoto);

module.exports = router;