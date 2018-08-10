const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const https = require('https');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

/*
 * Example
 * /celebration @user 🎂 / Happy Birthday!
 */
app.post('/slash-command', function(request, response) {

	var data = request.body;
	var userId = data.user_id;
	var text = data.text;
	var parts = text.split(' ');
	if(parts.length < 2) {
		var message = {
			text: "This is how you use the slash command: /celebrate @user [EMOJI] - Emoji Options include: 🎂,👏,🌴,💯, and 😂."
		}
    response.setHeader('Content-Type', 'application/json');
		response.status(200).send(JSON.stringify(message));
	} else {

    var toUser = parts[0];
		var message = parts[1];
    console.log("log check 1");

		var postMessageOptions = {
			host : 'slack.com',
			port : 443,
			path : '/api/chat.postMessage',
			method : 'POST',
			headers : {
				'Authorization': 'Bearer xoxp-403353889696-403825610948-410606203173-d0a5c221e6a93c29d5bab4126d2500e0',
			  'Content-Type' : 'application/json; charset=utf-8'
			}
		};

		var postMessageHttpsRequest = https.request(postMessageOptions, function(postMessageHttpsResponse) {

			var buffer = '';
			postMessageHttpsResponse.on('data', function(reqData) {
				buffer += reqData;
			});
			postMessageHttpsResponse.on('end', function() {
        console.log(buffer);
        console.log("log check 2");
				var postMessageResponse = JSON.parse(buffer);
				if(postMessageResponse.ok != true) {
					console.log(postMessageResponse);
				}
				// Slash command
        response.setHeader('Content-Type', 'application/json');
				response.status(200).send('Your message was sent successfully.');
			});
		});

		// TODO Check the message. If its a 🎂 change the message to HAPPY BIRTHDAY!!!!!!

      if (message === '🎂') {
        var postMessage = {
        text: 'Happy Birthday!',
  			channel: toUser,
  			as_user: true
      }} else if (message === '👏') {
        var postMessage = {
        text: 'Congratulations!',
        channel: toUser,
        as_user: true
      }} else if (message === '🌴') {
        var postMessage = {
        text: 'Have fun on vacation!',
        channel: toUser,
        as_user: true
      }} else if (message === '💯') {
        var postMessage = {
        text: 'Thanks for giving it your all!',
        channel: toUser,
        as_user: true
      }} else if (message === '😂') {
        var postMessage = {
        text: 'LOL!',
        channel: toUser,
        as_user: true
      }} else if (message === '📅') {
        var postMessage = {
        text: 'Happy Anniversary!',
        channel: toUser,
        as_user: true
      }
    };


		postMessageHttpsRequest.write(JSON.stringify(postMessage));
		postMessageHttpsRequest.end();
	}
});

/*
app.get('/slash-command', function(request, response) {
    response.send('Hello World!');
});
*/

app.listen(process.env.PORT || 8080, function() {
	console.log('\x1Bc');
	console.log('Celebration App Started');
});
