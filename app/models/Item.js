var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema;
//Schema.plugin(mongoosePaginate);

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
