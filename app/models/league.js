var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('League', new Schema({ 
	match: { type: Schema.Types.ObjectId, ref: 'Match' }, 
	amount: Number,
	matched: Boolean, 
	numTeams: Number,
	teams: [{ type: Schema.Types.ObjectId, ref: 'Team' }]
}));