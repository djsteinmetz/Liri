var keys = require('./keys')
var request = require('request')
var fs = require('fs')
var Twitter = require('twitter')
var Spotify = require('node-spotify-api');

var spotify = new Spotify({
    // Need to figure out how to add those in.  Can I just paste them?  Do I reference them? Are they secret?
    id: "",
    secret: ""
  });
var args = process.argv;
var userInquiry = [];
for(var i=2; i<args.length; i++) {
    userInquiry.push(args[i]);
};
userInquiry = userInquiry.join(" ");

spotify.search({ type: 'track', query: userInquiry }, function(err, data) {
  if (err) {
    return console.log('Error occurred: ' + err);
  }
 
console.log(data, null, 2); 
});
