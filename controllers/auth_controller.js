const bcrypt = require('bcrypt');
const models = require('../models');
const debug = require('debug')('photoApp:auth_controller');
const jwt = require('jsonwebtoken');
const { matchedData, validationResult } = require('express-validator');

/**
 * 
 * REGISTER
 * Register a new User
 *  
 */

const register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send({ status: 'fail', data: errors.array() });
    }

    const validData = matchedData(req);
    console.log("validated data:", validData);

    try {
        validData.password = await bcrypt.hash(validData.password, models.user_model.hashSaltRounds);
    } catch (error) {
        res.status(500).send({
            status:'error',
            message: 'Exception thrown when hashing the password.',
        });
        throw error;
    }

    try {
        const user = await new models.user_model(validData).save();

        res.send({
            status: 'success',
            data: {
                email: user.get('email'),
                first_name: user.get('first_name'),
                last_name: user.get('last_name'),
            }
        });

    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: 'Exception thrown in database when register a new user.'
        });
        throw error;
    }
}

/**
 * 
 * LOGIN
 */

const login = async (req, res) => {
    const { email, password } = req.body;
 
     
     const user = await models.user_model.login(email, password);
     if (!user) {
         return res.status(401).send({
             status: 'fail',
             data: 'Authentication failed.',
         });
     }

    const payload = {
        sub: user.get('email'),
        user_id: user.get('id'),
        name: user.get('first_name') + ' ' + user.get('last_name'),
    }

    const access_token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: process.env.ACCESS_TOKEN_EXPIRES_LIFETIME || '2h',
	});

    const refresh_token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: process.env.REFRESH_TOKEN_SECRET_LIFETIME || '2w',
	});

    return res.send({
        status: 'success',
        data: {
            access_token,
            refresh_token,
        }
    });
}


module.exports = {
    register,
    login,
}