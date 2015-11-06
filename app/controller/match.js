var Match = require('../models/match');


exports.add = function(req, res){
	// create a sample user
	var match = new Match({ 
		name: req.body.name,
		venue: req.body.venue,
		date: req.body.date,
		firstTeam: req.body.firstTeam,
		secondTeam: req.body.secondTeam,
		format: req.body.format
	});
	match.save(function(err) {
		if (err) throw err;

		console.log('Match saved successfully');
		res.json({ success: true });
	});
};