var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Variants = new Schema({
		size:  String,
		mrp:  Number,
		salePrice:  Number
	});

module.exports = mongoose.model('item', new Schema({ 
	name: String, 
	description: String, 
	category: String,
	brand: String,
	imgUrl: String,
	
	variants: [ Variants ]
}));
