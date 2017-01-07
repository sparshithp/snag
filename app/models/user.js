var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');


var userSchema = new Schema({
    name: String,
    password: {type: String, select: false},
    streetAddress: String,
    area: {type: String, lowercase: true, trim: true},
    city: {type: String, lowercase: true, trim: true},
    zip: {type: String, lowercase: true, trim: true},
    email: {type: String, lowercase: true, trim: true},
    phone: String,
    admin: Boolean,
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
    membership: {
        start: Date,
        end: Date
    },
    cart: [{
        itemId: String,
        variantId: String,
        quantity: Number
    }]
});

userSchema.pre('save', function(next) {
    var user = this;
    if (!user.isModified('password')) {
        return next();
    }
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(user.password, salt, function(err, hash) {
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(password, done) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        done(err, isMatch);
    });
};

module.exports = mongoose.model('User', userSchema);