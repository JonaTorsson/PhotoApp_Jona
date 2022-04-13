/**
 * Photo Controller
 * 
 */

const debug = require('debug')('photoApp:photo_controller');
const { matchedData, validationRules, validationResult } = require('express-validator');
const models = require('../models');

/**
 * Get all photos when logged in with a user
 * 
 * GET /photos
 */
const getPhotos = async (req, res) => {
    const user = await models.user_model.fetchById(req.user.user_id, { withRelated: ['photos'] });

    res.status(200).send({
        status: 'success',
        data: user.related('photos'),
    });
}

/**
 * Get a specific photo
 * 
 * GET /photos/:photoId
 */
const showPhoto = async (req, res) => {
    const user = await models.user_model.fetchById(req.user.user_id, { withRelated: ['photos'] });

    const allPhotos = user.related('photos');

    const photoSpecificId = allPhotos.find(photo => photo.id == req.params.photoId);

    if (!photoSpecificId) {
        res.status(404).send({
            status: 'error',
            message: 'Photo with your choosed ID was not found!',
        });
        return;
    }

    res.send({
        status: 'success',
        data: {
            id: photoSpecificId.id,
            title: photoSpecificId.get('title'),
            url: photoSpecificId.get('url'),
            comment: photoSpecificId.get('comment'),
        }
    });
}

/**
 * Add a new photo
 * 
 * POST /photos
 */
const addPhoto = async (req, res) => {
    const user = await models.user_model.fetchById(req.user.user_id, { withRelated: ['photos'] });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send({ 
            status: 'fail',
            data: errors.array()
        });
    }
    const validData = matchedData(req);

    validData.user_id = req.user.user_id;

    try {
        const photo = await new models.photo_model(validData).save();

        res.send({
            status: 'success',
            data: {
                title: photo.get('title'),
                url: photo.get('url'),
                comment: photo.get('comment'),
                user_id: user.id,
                id: photo.get('id'),
            }
        });
    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: 'Exception thrown in databse when creating a new photo.'
        });
        throw error;
    }
}

/**
 * Update a photo
 * 
 * PUT /photos/:photoId
 */
const updatePhoto = async (req, res) => {
    const user = await models.user_model.fetchById(req.user.user_id, { withRelated: ['photos'] });

    const photoId = req.params.photoId;

    const photo = await new models.photo_model({ id: photoId }).fetch({ require });

    if (!photo) {
        debug("Photo to update was not found! %o", { id: photoId });
        res.status(400).send({
            status: 'fail',
            status: 'Photo Not Found',
        });
        return;
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send({ status: 'fail', data: errors.array() });
    }

    const validData = matchedData(req);

    try {
        const updatePhoto = await photo.save(validData);
        debug("Updated photo succesfully: %o", updatePhoto);

        res.send({
            status: 'success',
            data: {
                title: photo.get('title'),
                url: photo.get('url'),
                comment: photo.get('comment'),
                user_id: user.id,
                id: photo.get('id'),
            }
        });
    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: 'Exception thrown in database when updating a photo.',
        });
        throw error;
    }
}

module.exports = {
    getPhotos,
    showPhoto,
    addPhoto,
    updatePhoto,
}