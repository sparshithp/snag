/**
 * Created by sparshithp on 1/7/17.
 */
var User = require('../models/user');
var Order = require('../models/order');
var constants = require('./Constants');


exports.createOrder = function(req, res){
    if(!req.body){
        return res.statusCode(400).send({
           message: "Bad request"
        });
    }
    var userId = req.decoded;
    var paymentMode = req.body.paymentMode;
    var cost = 0;
    var deliverySlot = req.body.deliverySlot;
    if(!paymentMode || checkValueInArray(paymentMode, constants.paymentModes)){
        return res.status(400).send({message: 'Please enter correct payment mode'});
    }
    if(!deliverySlot || checkValueInArray(deliverySlot, constants.deliverySlots)){
        return res.status(400).send({message: 'Please enter correct delivery slots'});
    }
    User.findById(userId, function(err, user){
        if(err){
            return res.status(400).send({ message: 'Encountered an error. Please try again.' });
        }
        if(!user){
            return res.status(400).send({ message: 'User not found. Please try again.' });
        }
        var cart = user.cart;
        if(!cart || cart.length == 0){
            return res.status(400).send({ message: 'Empty cart' });
        }
    });
};


function checkValueInArray(value, array){
    for(var i=0; i< array.length; i++){
        if(value == array[i]){
            return true;
        }
    }
    return false;
}

