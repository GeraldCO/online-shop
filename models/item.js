//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var itemSchema = new Schema({
  name: String,
  description: String,
  category : [{type: Schema.Types.ObjectId, ref: 'Category', required: true}],
  price: Number,
  stock: Number,
  URL : String,
  pictures: []
});

itemSchema
  .virtual('url')
  .get(function() {
    return '/product/' + this._id;
  })

module.exports = mongoose.model('Items', itemSchema);