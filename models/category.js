//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var CategorySchema = new Schema({
  name: String,
  description: String,
  URL : String
});

CategorySchema
  .virtual('url')
  .get(function() {
    return '/category/' + this._id;
  });


module.exports = mongoose.model('Category', CategorySchema);