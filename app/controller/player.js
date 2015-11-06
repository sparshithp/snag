var Player = require('../models/player');
var jwt  = require('jsonwebtoken');
var async = require('async');

var callback = function(){};

exports.add = function(req, res){
	var players = [];
	for(var i=0; i<req.body.players.length; i++){
		var iter = req.body.players[i];
		var player = new Player({
			name: iter.name, 
			testRating: iter.testRating,
			limitedOversRating: iter.limitedOversRating, 
			country: iter.country,
			ipl: iter.ipl,
			role: iter.role,
			countryStatus: true,
			iplStatus: true
		});
		players.push(player);
	}
	async.forEach(players, function(player, blank){
		player.save(function(err){
		if (err) 
			throw err;
		blank();
		});
	}, function(err){
		if(err){
			throw err;
		}
		console.log('Player saved successfully');
		res.json({ success: true });		
	});	
};