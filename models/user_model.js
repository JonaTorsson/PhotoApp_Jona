/**
 * User Model
 * 
 */

const bcrypt = require('bcrypt');

module.exports = (bookshelf) => {
    return bookshelf.model('user_model', {
        tableName: 'users',
        albums() {
            return this.hasMany('album_model');
        },
        tableName: 'users',
        photos() {
            return this.hasMany('photo_model');
        }
    
    }, {
        hashSaltRounds: 10,

        async login(email, password) {
            const user = await new this({ email }).fetch({ require: false });

            if(!user) {
                return false;
            }

            const hash = user.get('password');

            const result = await bcrypt.compare(password, hash);
            if (!result) {
                return false;
            }
            return user;
        },

        async fetchById(id, fethOptions = {}) {
            return await new this({ id }).fetch(fethOptions);
        }
    });
}