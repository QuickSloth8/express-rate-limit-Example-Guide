# express-rate-limit Example & Guide

This is an example & guide of utilizing [express-rate-limit](https://github.com/nfriedly/express-rate-limit) middleware.

**Only the server** side requires modifications. The client here is just for demonstration purpose.


## Import

	const rateLimit = require('express-rate-limit');


## Config & Use

	// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
	// see https://expressjs.com/en/guide/behind-proxies.html
	// app.set('trust proxy', 1);
	
	const limiter = rateLimit({
		windowMs: 0.1 * 60 * 1000, // 6 seconds
		max: 4, // limit each IP to 4 requests per windowMs
		keyGenerator: getClientIP,	// function used to generate keys
		onLimitReached: handleLimitExceeded // function that is called the first time a user hits the rate limit within a given window
	});

	app.use(limiter); // apply to all requests

* windowMs & max have very small values for demonstration purposes. Change as necessary.

Notice the keyGenerator parameter above. We assumed the absence of all reverse proxies, which means that we needed to change the default keyGenerator function.

Here is the code for the new keyGenerator:

	function getClientIP (req) {
		// only with the absence of proxies
		return req.connection.remoteAddress;
	}

We also decided to change the default onLimitReached function so that all of the rate-limit violating IPs get printed to the console:

	function handleLimitExceeded (req, res, options) {
		console.log("IP " + getClientIP(req) + " has exceeded requests' rate limit");
	}

* Here's additional info concerning [config options](https://github.com/nfriedly/express-rate-limit#configuration-options).


## Notes

* You can rate-limit specific endpoints/routes. To do so, remove `app.use(limiter);`, and instead, use the middleware on every required route.
* This middleware implements Sliding-Window rate limiting algorithm.



## Credits and Links
* The official documentation for the middleware: [https://github.com/nfriedly/express-rate-limit](https://github.com/nfriedly/express-rate-limit).
* The client side was taken from an example at [Medium](https://medium.com/@ajjogames/setting-up-a-simple-client-server-chatbot-application-using-react-and-node-45b3c7bd5235).