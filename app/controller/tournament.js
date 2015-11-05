var Tournament = require('../models/tournament');

exports.add = function(req, res){
	var matches = req.body.matches;
	var tournament = new Tournament({
		name: req.body.name, 
		startDate: req.body.startDate,
		endDate: req.body.endDate,
	});
	var allMatches = [];
	for(var i=0; i<matches.length; i++){
		var iter = matches[i];
		var  match = {
			date: iter.date,
			firstTeam: iter.firstTeam,
			secondTeam: iter.secondTeam,
			format: iter.format
		}
	}
	allMatches.push(match);
	tournament.matches = allMatches;
	tournament.save(function(err) {
	if (err) 
		throw err;
	console.log('Tournament saved successfully');
	res.json({ success: true });
	});
};