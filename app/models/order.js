/**
 * Created by sparshithp on 1/14/16.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var orderSchema = new Schema({
    userId: String,
    paymentMode: String,
    status: {type: String, default: "Placed"},
    date: {type: Date, default: Date.now},
    address: String,
    items: [{
        itemId: String,
        size: String,
        salePrice: String,
        mrp: String,
        quantity: String
    }],
    cost: Number,
    deliverySlot: String
});

module.exports = mongoose.model('Order', orderSchema);