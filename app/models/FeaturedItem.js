var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('featuredItem', new Schema({ 
	items: [String]
}));
