var User = require('../models/user');
var Item = require('../models/Item');
var jwt = require('jsonwebtoken');

exports.signup = function (req, res) {
    // create a sample user
    if(!req.body){
        res.status(400).send({message: 'Required fields missing'});
    }
    var name = req.body.name,
        password = req.body.password,
        streetAddress = req.body.streetAddress,
        area = req.body.area,
        city = req.body.city,
        zip = req.body.zip,
        email = req.body.email,
        phone = req.body.phone;


    if(!name || name.trim()==""){
        res.status(400).send({message: 'Please input full name'});
        return;
    }
    if(!email || email.trim()==""){
        res.status(400).send({message: 'Please input valid email'});
        return;
    }
    if(!password || password.trim()==""){
        res.status(400).send({message: 'Please input valid password'});
        return;
    }
    if(!phone || phone.trim()==""){
        res.status(400).send({message: 'Please input valid phone number'});
        return;
    }
    if(!streetAddress || streetAddress.trim()==""){
        res.status(400).send({message: 'Please input valid address'});
        return;
    }
    if(!city || city.trim()==""){
        res.status(400).send({message: 'Please input valid city'});
        return;
    }
    if(!zip || zip.trim()==""){
        res.status(400).send({message: 'Please input valid zip code'});
        return;
    }
    if(!area || area.trim()==""){
        res.status(400).send({message: 'Please input valid area'});
        return;
    }

    email = email.toLowerCase();
    if(!validateEmail(email)){
        res.status(400).send({message: 'Please enter the correct email.'});
        return;
    }
    if(password.length <8){
        res.status(400).send({message: 'Password length should be minimum 8 characters.'});
        return;
    }
    var user = new User({
        name: req.body.name,
        password: req.body.password,
        streetAddress: req.body.streetAddress,
        area: req.body.area,
        city: req.body.city,
        zip: req.body.zip,
        email: req.body.email,
        phone: req.body.phone,
        admin: false,
        cart: []
    });

    User.findOne({email: email}, function(err, existingUser){
        if(err){
            res.status(400).send({message: 'Network error. Please try again'});
        } else if(existingUser){
            res.status(400).send({message: 'User already exists'});
        }else {
            user.save(function (err) {
                if (err) {
                    console.log(err);
                    res.status(400).send({message: 'Error saving. Please try again'});
                } else {
                    console.log("yoyo");
                    res.send({token: createToken(req, user)});
                }
            });
        }
    });

};

exports.signin = function(req, res) {
    // middle parameter..
    //check err everywhere
    if(!req.body || !req.body.email){
        return res.status(400).send({message: 'Required fields missing'});
    }

    var email = req.body.email.toLowerCase();

    User.findOne({ email: email }, '+password', function(err, user){
        if(err){
            return res.status(400).send({ message: 'Encountered an error. Please try again' });
        }
        if (!user) {
            return res.status(401).send({ message: 'Invalid credentials' });
        }

        user.comparePassword(req.body.password, function(err, isMatch){
            if(err) {
                return res.status(400).send({ message: 'Encountered an error. Please try again' });
            }
            if (!isMatch) {
                return res.status(401).send({ message: 'Invalid credentials' });
            }
            res.status(200).send({
                user: user.email ,
                token: createToken(req, user)
            });
        });
    });
};

exports.startMembership = function(req, res) {
    if(!req.body || !req.body.userId || !req.body.months) {
        return res.status(400).send({ message: 'Bad request' });
    }
    if(req.body.months < 1) {
        return res.status(400).send({ message: 'Bad request' });
    }
    User.findById(req.body.userId, function(err, user){
        if(err){
            return res.status(400).send({ message: 'Encountered an error. Please try again' });
        }
        if(!user){
            return res.status(400).send({ message: 'Invalid User Id' });
        }
        var membership = {};
        var currentDate = new Date();
        membership.start = currentDate;
        membership.end = currentDate.setMonth(currentDate.getMonth()+req.body.months);
        user.membership = membership;
        user.save(function(err){
           if(err){
               return res.status(400).send({ message: 'Encountered an error. Please try again' });
           }
            return res.status(200).send({ message: 'Membership updated' });

        });
    })
};

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function createToken(req, user) {
    var token = jwt.sign(user, req.app.get('superSecret'), {
        expiresIn : 60*60*24
    });
    return token;
}

exports.getById = function(req, res){

    User.findById(req.params.id, function(err, user){
        if(err){
            res.send({message : "Problem retrieving"});
        }else{
            res.send({user: user});
        }
    });
};

exports.listAll = function(req, res){

    User.find({}, function(err, user){
        if(err){
            res.send({message : "Problem retrieving"});
        }else{
            res.send({users: user});
        }
    });
};

exports.addItemToCart = function(req, res){
	
	var cartItem = User.CartItem;
	
	if(req.body.itemId == null || req.body.variantId == null){
		res.send("No item id");
	}else{

		var userId = req.decoded._id;

		cartItem.itemId = req.body.itemId;
		cartItem.variantId = req.body.variantId;
		cartItem.quantity = req.body.quantity;
		
		User.findById(userId, function(err, user){
	        if(err || user == null){
	            res.send({message : "Problem finding user"});
	        }else{
	        	user.cart.push(cartItem);
	        	user.save(function (err) {
	                if (err) {
	                    console.log(err);
	                    res.status(400).send({message: 'Error saving. Please try again'});
	                } else {
	                    res.send("Item added to cart");

	                }
	            });
	        }
	    });
	}
};

exports.updateCart = function(req, res){
	
	
	if(req.body.cart == null ){
		res.send("No cart");
	}else{

		var userId = req.decoded._id;

		User.findById(userId, function(err, user){
	        if(err || user == null){
	            res.send({message : "Problem finding user"});
	        }else{
	        	user.cart = req.body.cart;
	        	user.save(function (err) {
	                if (err) {
	                    console.log(err);
	                    res.status(400).send({message: 'Error saving. Please try again'});
	                } else {
	                    res.send("Cart updated");
	                }
	            });
	        }
	    });
	}
};

exports.viewCart = function(req, res){
	
	 User.findById(req.decoded._id, function(err, user){
	        if(err || user == null){
	            res.send({message : "Problem retrieving"});
	        }else{
	        	
	        	getVariant(user.cart, function(err, response){
	        		if(err){
	        			console.log(err);
	        		}else{
	        			res.send({cart: response});
	        		}
	        	});
	        }
	    });
};

function getVariant(cart, callback){
	
	var I = {
			"itemId" : String,
			"variantId" : String,
			"name" : String,
			"imgUrl" : String,
			"size" : String,
			"quantity" : Number,
			"price" : Number,
			"cost" : Number
	}
	var response = {
			"items" : [I],
			"totalCost" : Number
	};
	response.totalCost =0;
	response.items = [];
	
	var counter = 0;
	if(cart == null || cart.length == 0){
		callback(null, response);
	}
	var length = cart.length;
	for(var i=0; i<length; i++){
		var cartItem = cart[i];
		
		console.log(cartItem);
		console.log(cartItem.itemId);
		
		Item.findById(cartItem.itemId, function(err, item){
	        if(err || item == null){
	            console.log("item not found !!!!!!!!!!")
	            counter++;
	        }else{
	            
	        	for(var j =0 ; j<item.variants.length; j++){
	        		var variant = item.variants[j];
	        		if(variant._id == cartItem.variantId){
	        			
	        			I.itemId = cartItem.itemId;
		        		I.variantId = variant._id;
		        		I.name = item.name;
		        		I.imgUrl = item.imgUrl;
		        		I.size = variant.size;
		        		I.quantity = cartItem.quantity;
		        		I.price = variant.salePrice;
		        		I.cost = I.price * cartItem.quantity;
		        		response.items.push(I);
		        		response.totalCost = response.totalCost + I.cost;
	        		}
	        	}
	        	counter++;
	        }
	        if(counter == length){
				callback(null, response)
			}
	    });
	}
}

