var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Match', new Schema({ 
	name: String,
	venue: String,
	date: Date,
	firstTeam: String,
	secondTeam: String,
	format: String
}));