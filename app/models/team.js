var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Team', new Schema({ 
	username: String,
	match: { type: Schema.Types.ObjectId, ref: 'Match' },
	firstBatsman: { type: Schema.Types.ObjectId, ref: 'Player' },
	secondBatsman: { type: Schema.Types.ObjectId, ref: 'Player' },
	allRounder: { type: Schema.Types.ObjectId, ref: 'Player' },
	firstBowler: { type: Schema.Types.ObjectId, ref: 'Player' },
	secondBowler: { type: Schema.Types.ObjectId, ref: 'Player' }
}));