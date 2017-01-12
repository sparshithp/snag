/**
 * Created by sparshithp on 1/7/17.
 */
var User = require('../models/user');
var Order = require('../models/order');
var Item = require('../models/Item');
var constants = require('./Constants');


exports.createOrder = function (req, res) {
    console.log(req.body);
    if (!req.body) {
        return res.statusCode(400).send({
            message: "Bad request"
        });
    }
    var userId = req.decoded._id;
    var paymentMode = req.body.paymentMode;
    var notes = req.body.notes;
    var cost = 0;
    var deliverySlot = req.body.deliverySlot;
    if (!paymentMode || !checkValueInArray(paymentMode, constants.paymentModes)) {
        return res.status(400).send({message: 'Please enter correct payment mode'});
    }
    if (!deliverySlot || !checkValueInArray(deliverySlot, constants.deliverySlots)) {
        return res.status(400).send({message: 'Please enter correct delivery slots'});
    }
    // var orderedItems = [];
    User.findById(userId, function (err, user) {
        if (err) {
            console.log(err);
            return res.status(400).send({message: 'Encountered an error. Please try again.'});
        }
        if (!user) {
            return res.status(400).send({message: 'User not found. Please try again.'});
        }
        var cart = user.cart;
        if (!cart || cart.length == 0) {
            return res.status(400).send({message: 'Empty cart'});
        }

        calculateCost(cart, function (err, orderedItems) {

            if (err) {
                return res.status(400).send({message: 'Encountered an error. Please try again.'});
            } else {
            	var totalMrp = 0;
            	var cost = 0;
                for(var i=0; i<orderedItems.length; i++){
                	cost += orderedItems[i].salePrice * orderedItems[i].quantity;
                	totalMrp += orderedItems[i].mrp * orderedItems[i].quantity;
                }
                var order = new Order();
                order.userId = userId;
                order.paymentMode = paymentMode;
                order.address = user.streetAddress + ', ' + user.area;
                order.items = orderedItems;
                order.deliverySlot = deliverySlot;
                order.cost = cost;
                order.notes = notes;
                order.moneySaved = (totalMrp - cost )> 0 ? (totalMrp - cost ): 0;
                order.save(function (err) {
                    if (err) {
                        return res.status(400).send({message: 'Encountered an error. Please try again.'});
                    }
                    res.status(200).send({order: order});
                    user.cart = [];
                    user.moneySaved += order.moneySaved;
                    user.save(function(err){
                       if(err){
                           console.log(err);
                       }else{
                           console.log("Saved");
                       }
                    });
                });
            }
        });
    });
};


exports.listForUser = function(req, res){
    var userId = req.decoded._id;
    Order.find({userId: userId}, function(err, orders){
       if(err){
           return res.status(404).send({message: 'Encountered an error. Please try again.'});
       }
       if(orders == null || orders.length == 0){
    	   res.send("You do not have any orders yet");
       }
       
       var moneySaved = 0;
       for(var i=0; i<orders.length; i++){
    	   if(orders[i].moneySaved != null)
    		   moneySaved += orders[i].moneySaved;
       }
       res.status(200).send({orders: orders, moneySaved: moneySaved});
    });
};

exports.cancel = function(req, res){
    var userId = req.decoded._id;
    var orderId = req.params.orderId;
    if(!orderId){
        return res.status(400).send({message: 'Invalid order number.'});
    }
    Order.findOne({userId: userId, _id:orderId}, function(err, order){
       if(err){
           return res.status(404).send({message: 'Encountered an error. Please try again.'});
       }
        if(!order){
            return res.status(400).send({message: 'Wrong order number.'});
        }
        order.status = "Cancelled";
        order.save(function(err){
           if(err){
               return res.status(404).send({message: 'Encountered an error. Please try again.'});
           }
            res.status(200).send({message: 'Cancelled'});
        });
    });
};

exports.getOrder = function(req, res){
    var userId = req.decoded._id;
    var orderId = req.params.orderId;
    if(!orderId){
        return res.status(400).send({message: 'Invalid order number.'});
    }
    Order.findOne({userId: userId, _id:orderId}, function(err, order){
        if(err){
            return res.status(404).send({message: 'Encountered an error. Please try again.'});
        }
        if(!order){
            return res.status(400).send({message: 'Wrong order number.'});
        }
        res.status(200).send({order: order});
    });
};

function calculateCost(cart, callback) {

    var orderedItems = [];
    var itemIdSet = [];
	var length = cart.length;
	for(var i=0; i<length; i++){
		var itemId = cart[i].itemId;
		itemIdSet.push(itemId);
	}
	
	Item.find( {_id: {$in: itemIdSet}} , function(err, items){
	       
		if(err || items == null){
			return res.status(400).send({message: 'Items not found.'});
        }else{
        	
        	console.log("--items length -- " + items.length);
        	for(var i=0; i<items.length; i++){
        		
        		var item = items[i];
        		for(var k=0; k<cart.length; k++){
        			
        			var cartItem = cart[k];
        			if(cartItem.itemId == item._id){
        				
        				for(var j =0; j<item.variants.length; j++){
        					var variant = item.variants[j];
        					if(variant._id == cartItem.variantId){
        						var orderedItem = {};
        				        orderedItem.itemId = cartItem.itemId;
        				        orderedItem.variantId = cartItem.variantId;
        				        orderedItem.quantity = cartItem.quantity;
        				        orderedItem.size = variant.size;
        	                    orderedItem.salePrice = variant.salePrice;
        	                    orderedItem.mrp = variant.mrp;
        	                    orderedItems.push(orderedItem);
            	        		break;
                    		}
                    	}
        			}
        		}
        	}
        	callback(null, orderedItems);
        }
    });
    
}

function checkValueInArray(value, array) {
    for (var i = 0; i < array.length; i++) {
        if (value == array[i]) {
            return true;
        }
    }
    return false;
}

