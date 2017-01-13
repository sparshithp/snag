var FeaturedItem = require('../models/FeaturedItem');
var Item = require('../models/Item');
var jwt  = require('jsonwebtoken');

exports.add = function(req, res) {
	
	if(req.body.items == null || req.body.items.length == 0 ){
		res.send("no items");
	}
	
	 FeaturedItem.find({}, function(err, fItems){
	        if(err){
	            res.send({message : "Problem retrieving"});
	        }else if(fItems == null || fItems.length ==0){
	        	
	        	var featuredItem = new FeaturedItem();
	        	featuredItem.items = req.body.items;
	        	featuredItem.save(function(err){
	                if(err){
	                    res.send({message: "Problem adding item"})
	                }else{
	                    res.send({message: "Successful"})
	                }
	            });
	        	
	        } else{
	        	var featuredItem = fItems[0];
	        	featuredItem.items = req.body.items;
	        	featuredItem.save(function(err){
	                if(err){
	                    res.send({message: "Problem adding item"})
	                }else{
	                    res.send({message: "Successful"})
	                }
	            });
	        }
	 });
	 
	
};

exports.listAll = function(req, res){

	var query = FeaturedItem.find({});
	
	query.exec(function(err, items){
        if(err){
            res.send({message : "Problem retrieving"});
        }else{
            res.send({featuredItems: items});
        }
    });
};

exports.getItems = function(req, res){

    FeaturedItem.find({}, function(err, fItems){
        if(err){
            res.send({message : "Problem retrieving"});
        }else{
        	
        	var itemIds = fItems[0].items;
        	Item.find( {_id: {$in: itemIds}} , function(err, items){
        		if(err || items == null){
        			return res.status(400).send({message: 'Items not found.'});
                }else{
                	res.send({items : items});
                }
        	});
        }
    });
};
