var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Tournament', new Schema({ 
	name: String, 
	startDate: Date,
	endDate: Date, 
	matches: [{
		date: Date,
		firstTeam: String,
		secondTeam: String,
		format: String
	}]
}));