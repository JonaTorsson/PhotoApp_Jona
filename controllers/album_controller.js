/**
 * Album  controller
 * 
 */

const debug = require('debug')('photoApp:album_controller');
const { matchedData, validationResult } = require('express-validator');
const models = require('../models');


/**
 * GET all albums in logged in user
 * 
 * GET /albums
 */
 const getAlbums = async (req, res) => {
	const user = await models.user_model.fetchById(req.user.user_id, {
		withRelated: ['albums'] });
 
	res.status(200).send({
		 status: 'success',
		 data: user.related('albums')
	 });
 };

 /**
  * GET a specific album
  * 
  * GET /albums/:albumId
  */
  const showAlbum = async (req, res) => {
	const albumId = req.params.albumId;
	const user_id = req.user.user_id;
	const album = await new models.album_model({ id: albumId, user_id: user_id }).fetch({ withRelated: ['photos'], require: false });
	if (!album) {
		res.status(404).send({
			status: 'fail',
			data: 'Album not found',
		})
	} else {
		res.status(200).send({
			status: 'success',
			data: album,
		});
	};
};

/**
 * POST a new album
 * 
 * POST /albums
 */
 const addAlbum = async (req, res) => {

	const user = await models.user_model.fetchById(req.user.user_id, { withRelated: ['albums'] });

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ status: 'fail', data: errors.array() });
	}
	const validData = matchedData(req);

	validData.user_id = req.user.user_id;
 
	try {
		const album = await new models.album_model(validData).save();
		debug("Created new album successfully: %O", album);

		res.send({
			status: 'success',
			data: {
				title: album.get('title'),
				user_id: user.id,
				id: album.get('id'),
			}
		});
 
	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown in database when creating a new Album.',
		});
		throw error;
	}
}

/**
 * Update an album
 * 
 * PUT /albums/:albumId
 */
 const updateAlbum = async (req, res) => {

	const user = await models.user_model.fetchById(req.user.user_id, { withRelated: ['albums'] });

	const albumId = req.params.albumId;
 
	const album = await new models.album_model({ id: albumId }).fetch({ require: false });
	if (!album) {
		debug("Album to update was not found. %o", { id: albumId });
		res.status(404).send({
			status: 'fail',
			data: 'Album Not Found',
		});
		return;
	}
 
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ status: 'fail', data: errors.array() });
	}
 
	const validData = matchedData(req);
 
	try {
		const updatedAlbum = await album.save(validData);
		debug("Updated album successfully: %O", updatedAlbum);
 
		res.status(200).send({
			status: 'success',
			data: {
				title: album.get('title'),
				user_id: user.id,
				id: album.get('id'),
			},
		});
 
	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown in database when updating a new album.',
		});
		throw error;
	}
};

/**
 * Add a photo in album
 * 
 * POST /albums/:albumId/photos
 */
const addPhoto = async (req, res) => {
	// Check for validation error
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ status: 'fail', data: errors.array() });
	}

	// Just save the requested i asked in validData
	const validData = matchedData(req);
	
	// Get relation to users album
	const user = await models.user_model.fetchById(req.user.user_id, { withRelated: ['albums', 'photos'] });

	// Get out the relation that's between album and photo
	const album = await models.album_model.fetchById(req.params.albumId, { withRelated: ['photos'] });

	// Get out the requested album
	const userAlbum = user.related('albums').find(album => album.id == req.params.albumId);

	// Get only the photo that belongs to the user who's logged in
	const userPhoto = user.related('photos').find(photo => photo.id == validData.photo_id);

	// Check if photo already exists in album
	const existing_photo = album.related('photos').find(photo => photo.id == validData.photo_id);

	// Photo already exists, bail
	if (existing_photo) {
		return res.status(404).send({
			status: 'fail',
			data: 'Photo already exists.',
		});
	}

	if (!album) {
		debug("Album to update was not found. %o", { id: album });
		res.status(404).send({
			status: 'fail',
			data: 'Album Not Found',
		});
		return;
	}

	// If their is not a user in album or user, bail
	if (!userAlbum || !userPhoto) {
		return res.status(401).send({
			status: 'fail',
			data: 'Album or Photo does not belong to user',
		});
	}

	try {
		const result = await userAlbum.photos().attach(validData.photo_id);
		debug("Added photo to Album successfully: %O", result, result.length);

		res.status(200).send({
			status: 'success',
			data: null,
		});

	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown in database when adding a photo to an album.',
		});
		throw error;	
}};





 module.exports = {
	getAlbums,
	showAlbum,
	addAlbum,
	updateAlbum,
	addPhoto,
}