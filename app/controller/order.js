/**
 * Created by sparshithp on 1/7/17.
 */
var User = require('../models/user');
var Order = require('../models/order');
var Item = require('../models/Item');
var constants = require('./Constants');


exports.createOrder = function (req, res) {
    if (!req.body) {
        return res.statusCode(400).send({
            message: "Bad request"
        });
    }
    var userId = req.decoded._id;
    var paymentMode = req.body.paymentMode;
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
                var cost = 0;
                for(var i=0; i<orderedItems.length; i++){
                    cost += orderedItems[i].salePrice * orderedItems[i].quantity;
                }
                var order = new Order();
                order.userId = userId;
                order.paymentMode = paymentMode;
                order.address = user.streetAddress + ', ' + user.area;
                order.items = orderedItems;
                order.deliverySlot = deliverySlot;
                order.cost = cost;
                order.save(function (err) {
                    if (err) {
                        return res.status(400).send({message: 'Encountered an error. Please try again.'});
                    }
                    res.status(200).send({order: order});
                    user.cart = [];
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
       res.status(200).send({orders: orders});
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

function calculateCost(cart, callback) {

    var orderedItems = [];
    var counter = 0;
    var cost=0;
    for (var i = 0; i < cart.length; i++) {
        var orderedItem = {};
        var item = cart[i];
        var variantId = item.variantId;
        orderedItem.itemId = item.itemId;
        orderedItem.quantity = item.quantity;
        Item.findById(item.itemId, function (err, item) {
            if(!item){
                return res.status(400).send({message: 'Item not found.'});
            }
            for (var j = 0; j < item.variants.length; j++) {
                var variant = item.variants[j];
                if (variantId == variant._id) {
                    orderedItem.size = variant.size;
                    orderedItem.salePrice = variant.salePrice;
                    orderedItem.mrp = variant.mrp;
                    cost += variant.salePrice * item.quantity;
                }
            }
            orderedItems.push(orderedItem);
            counter++;
            if (counter == cart.length) {
                callback(null, orderedItems);
            }
        });
    }
}
function checkValueInArray(value, array) {
    for (var i = 0; i < array.length; i++) {
        if (value == array[i]) {
            return true;
        }
    }
    return false;
}

