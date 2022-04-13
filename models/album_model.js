/**
 * Album model
 * 
 */

module.exports = (bookshelf) => {
    return bookshelf.model('album_model', {
        tableName: 'albums',
        users() {
            return this.belongsTo('user_model');
        },
        tableName: 'albums',
        photos() {
            return this.belongsToMany('photo_model');
        }
    }, {
        async fetchById(id, fetchOptions = {}) {
            return await new this({ id }).fetch(fetchOptions);
        }
    });
}