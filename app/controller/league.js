var League = require('../models/league');

exports.addTeam = function(req, res){
	League.findOne({
		match: req.body.match,
		matched: false,
		numTeams: req.body.numTeams,
		amount: req.body.amount
	}, function(err, league){
		if(err) 
			throw err;
		if(!league){
			league = new League({
				match: req.body.match,
				matched: false,
				numTeams: req.body.numTeams,
				amount: req.body.amount,
				teams: []
			});
		}
		league.teams.push(req.body.team);
		if(league.teams.length == league.numTeams){
			league.matched = true;
		}
		league.save(function(err){
			if(err)
				throw err;
			res.json({success: true});
		});
	} );
};

