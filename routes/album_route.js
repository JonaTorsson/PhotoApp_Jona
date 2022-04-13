const express = require('express');
const router = express.Router();
const albumController = require('../controllers/album_controller');
const albumValidationRules = require('../validation/album');

/**
 * GET all albums to the logged in user
 * GET /albums
 * 
 */
router.get('/', albumController.getAlbums);

/**
 * GET a specific album
 * GET /albums/:albumId
 * 
 */
router.get('/:albumId', albumController.showAlbum);

/**
 * POST a new album
 * POST /albums
 * 
 */
router.post('/', albumValidationRules.createRules, albumController.addAlbum);

/**
 * Update an album
 * PUT /albums/albumId
 * 
 */
router.put('/:albumId', albumValidationRules.updateRules, albumController.updateAlbum);

/**
 * Add a photo in an album
 * POST /album/:albumId/photos
 */
router.post('/:albumId/photos', albumValidationRules.addPhotoRules, albumController.addPhoto);

module.exports = router;