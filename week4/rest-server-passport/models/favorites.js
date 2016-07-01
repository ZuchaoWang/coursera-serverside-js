// grab the things we need
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var favoriteSchema = new Schema({
  dish: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dish'
  },
  favoriteBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

var Favorites = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorites;
