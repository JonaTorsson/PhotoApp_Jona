/**
 * Photo model
 * 
 */

module.exports = (bookshelf) => {
    return bookshelf.model('photo_model', {
        tableName: 'photos',
        users() {
            return this.belongsTo('user_model');
        },
        tableName: 'photos',
        albums() {
            return this.belongsToMany('album_model');
        },
    }, {
        async fetchById(id, fetchOptions = {}) {
            return await new this({ id }).fetch(fetchOptions);
        }
    });
}