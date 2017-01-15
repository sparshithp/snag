var Item = require('../models/Item');
var jwt  = require('jsonwebtoken');

exports.add = function(req, res) {
	
	var item = new Item();
	item.name = req.body.name;
	if(req.body.category != null){
		item.category = req.body.category.toLowerCase()	;
	}
	if(req.body.brand != null){
		item.brand = req.body.brand.toLowerCase();
	}
	item.description = req.body.description;
	item.imgUrl = req.body.imgUrl;
	item.variants = req.body.variants;
	
	item.save(function(err){
        if(err){
            res.send({message: "Problem adding item"})
        }else{
            res.send({message: "Successful"})
        }
    });
};

exports.listAll = function(req, res){

	//var query = Item.find({}).skip(1).limit(2);
	var query = Item.find({});//.skip(1).limit(2);
	
	query.exec(function(err, items){
        if(err){
            res.send({message : "Problem retrieving"});
        }else{
            res.send({items: items});
        }
    });
};

exports.getById = function(req, res){

    Item.findById(req.params.id, function(err, item){
        if(err){
            res.send({message : "Problem retrieving"});
        }else{
            res.send({item: item});
        }
    });
};

exports.listByCategory = function (req, res) {
    
	console.log("listByCategory");

    var query = Item.find(
        {
            category: { $regex : new RegExp(req.params.category, "i") }
            
        });

    query.exec(function (err, items) {
        if (err) {
            res.send({message: "error"});
        } else {
        	console.log("found " + items.length);
        	res.send({items: items});
        }
    });
};

exports.listByBrand = function (req, res) {
    
    var query = Item.find(
        {
            brand: { $regex : new RegExp(req.params.brand, "i") }
            
        });

    query.exec(function (err, items) {
        if (err) {
            res.send({message: "error"});
        } else {
        	console.log("found " + items.length);
        	res.send({items: items});
        }
    });
};

exports.listByPriceRange = function (req, res) {
    
//    var query = Item.find(
//        {
//            brand: { $gt: req.param.min, $lt: req.param.max }
//            
//        });
//
//    query.exec(function (err, items) {
//        if (err) {
//            res.send({message: "error"});
//        } else {
//        	console.log("found " + items.length);
//        	res.send({items: items});
//        }
//    });
};