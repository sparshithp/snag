var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Player', new Schema({ 
	name: String, 
	testRating: Number,
	limitedOversRating: Number, 
	country: String,
	ipl: String,
	role: String 
}));