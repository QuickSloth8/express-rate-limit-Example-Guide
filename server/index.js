const express = require('express');
const rateLimit = require('express-rate-limit');
const cors = require('cors');


function getClientIP (req) {
	// only with the absence of proxies
	return req.connection.remoteAddress;
}


function handleLimitExceeded (req, res, options) {
	console.log("IP " + getClientIP(req) + " has exceeded requests' rate limit");
}


var app = express();
app.use(cors());
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
app.use(express.json()); // JSON encoded body


app.get('/',function(req,res) {
 res.send('Hi! I am a ChatBot.');
});

app.post("/postMessage",function(req,res) {
 let message = req.body.message.toLowerCase()
 
 if(message === 'hello' || message === 'hi') {
  res.send({"bot_message":"Hi! Hope you are well"});
 } else {
  res.send({"bot_message":"Sorry, I don't understand"});
 }
})
var server = app.listen(3001,function() {});
console.log("Listening to server at port 3001");
