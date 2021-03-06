// =================================================================
// get the packages we need ========================================
// =================================================================
var express 	= require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var User   = require('./app/models/user'); // get our mongoose model
//==================================================================
// controllers
//==================================================================
var userController = require('./app/controller/user');
var itemController = require('./app/controller/ItemController');
var orderController = require('./app/controller/order');
var featuredItemController = require('./app/controller/FeaturedItemController');
// =================================================================
// configuration ===================================================
// =================================================================
var port = process.env.PORT || 8080; // used to create, sign, and verify tokens
mongoose.connect(config.database); // connect to database
app.set('superSecret', config.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

// =================================================================
// routes ==========================================================
// =================================================================

app.post('/signup', userController.signup);
app.get('/users', function(req, res) {
	User.find({}, function(err, users) {
		res.json(users);
	});
});
app.post('/startMembership', userController.startMembership);
app.post('/login', userController.signin);

// basic route (http://localhost:8080)
app.get('/', function(req, res) {
	res.send('Hello! The API is at http://localhost:' + port + '/api');
});

// ---------------------------------------------------------
// get an instance of the router for api routes
// ---------------------------------------------------------
var apiRoutes = express.Router(); 

// ---------------------------------------------------------
// authentication (no middleware necessary since this isnt authenticated)
// ---------------------------------------------------------
// http://localhost:8080/api/authenticate

// ---------------------------------------------------------
// route middleware to authenticate and check token
// ---------------------------------------------------------
apiRoutes.use(function(req, res, next) {

	// check header or url parameters or post parameters for token
	var token = req.body.token || req.param('token') || req.headers['x-access-token'];

	// decode token
	if (token) {

		// verifies secret and checks exp
		jwt.verify(token, app.get('superSecret'), function(err, decoded) {			
			if (err) {
				return res.json({ success: false, message: 'Failed to authenticate token.' });		
			} else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;	
				next();
			}
		});

	} else {

		// if there is no token
		// return an error
		return res.status(403).send({ 
			success: false, 
			message: 'No token provided.'
		});
		
	}
	
});

// ---------------------------------------------------------
// authenticated routes
// ---------------------------------------------------------

apiRoutes.get('/', function(req, res) {
	res.json({ message: 'Welcome to the coolest API on earth!' });
});

apiRoutes.get('/users', function(req, res) {
	User.find({}, function(err, users) {
		res.json(users);
	});
});

apiRoutes.get('/check', function(req, res) {
	res.json(req.decoded);
});

app.get('/featuredItems/items', featuredItemController.getItems);
app.get('/featuredItems/listAll', featuredItemController.listAll);
app.post('/featuredItems/add', featuredItemController.add);

app.get('/items/listAll', itemController.listAll);
app.post('/items/add', itemController.add);
app.get('/items/getById/:id', itemController.getById);
app.get('/items/listByCategory/:category/:page', itemController.listByCategory);
app.get('/items/listByBrand/:brand', itemController.listByBrand);
app.get('/items/listByBrand/:min/:max', itemController.listByPriceRange);

app.get('/users/listAll', userController.listAll);
apiRoutes.post('/users/editProfile', userController.updateProfile);
apiRoutes.post('/users/addToCart', userController.addItemToCart);
apiRoutes.post('/users/updateCart', userController.updateCart);
apiRoutes.get('/users/profile', userController.getById);
apiRoutes.get('/users/viewCart', userController.viewCart);
apiRoutes.post('/order/create', orderController.createOrder);
apiRoutes.get('/order/listForUser', orderController.listForUser);
apiRoutes.get('/order/get/:orderId', orderController.getOrder);
apiRoutes.get('/order/cancel/:orderId', orderController.cancel);

app.use('/api', apiRoutes);

// =================================================================
// start the server ================================================
// =================================================================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);
