var Team = require('../models/team');

exports.add = function(req, res){
	var team = new Team({
		username: req.decoded.name,
		match: req.body.matchId,
		firstBatsman: req.body.firstBatsmanId,
		secondBatsman: req.body.secondBatsmanId,
		allRounder: req.body.allRounderId,
		firstBowler: req.body.firstBowlerId,
		secondBowler: req.body.secondBowlerId
	});
	team.save(function(err){
		if(err){
			throw err;
		}
		res.json({success: true});
	});
};

exports.getAll = function(req, res){
	var criteria = req.body;
	criteria.username = req.decoded.name;
	console.log(criteria);
	Team.find(criteria).populate('match firstBatsman secondBatsman firstBowler secondBowler allRounder').exec(function(err, teams){
		res.json({teams: teams});
	});
}