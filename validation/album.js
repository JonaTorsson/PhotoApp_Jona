/**
 * ValidationRules Album
 */

const { body } = require('express-validator');
const models = require('../models');

/**
 * Rules to add a new album
 * POST /albums
 * 
 */
const createRules = [
    body('title').exists().isString().isString().isLength({ min: 3 }).custom(async value => {
        const title = await new models.album_model({ title: value }).fetch({ require: false });

        if (title) {
            return Promise.reject('Title for album already exist.');
        }
        return Promise.resolve();
    }),
];

/**
 * Rules for update a album
 * PUT /albums/albumId
 * 
 */
const updateRules = [
    body('title').exists().isString().isLength({ min: 3 }).custom(async value => {
        const title = await new models.album_model({ title: value }).fetch({ require: false });

        if (title) {
            return Promise.reject('Title for album already exist.');
        }
        return Promise.resolve();
    }),
];

/**
 * Rules for add a photo to a album
 * 
 */
const addPhotoRules = [
    body('photo_id').exists().isInt().bail().custom(async value => {
        const photo = await new models.photo_model({ id: value }).fetch({ require: false });

        if (!photo) {
            return Promise.reject(`Photo with ID ${value} does not exist.`);
        }
        return Promise.resolve();
    }),
];

module.exports = {
    createRules,
    updateRules,
    addPhotoRules,
}