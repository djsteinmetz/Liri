// Require a .env file containing API keys
require('dotenv').config();
// Reference the API keys
var keys = require('./keys');
// Reference the node-packages for the following
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var request = require('request');
var fs = require('fs');
var moment = require('moment');
// Initialize variables
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var command = process.argv[2];
var args = process.argv;
var userInquiry = [];
// Initialize functions 
// spotify-this-song function
function spotifyThis() {
  stringifyArgs();
  spotify.search({ type: 'track', query: userInquiry, limit: 20 }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    consoleInit();
    // Loop through artists and combine
    var artists = data.tracks.items[0].artists
    for(var i=0; i<artists.length; i++) {
      console.log("Artist(s): " + artists[i].name);
    };
    console.log("Song name: " + data.tracks.items[0].name);
    console.log("Preview: " + data.tracks.items[0].preview_url); 
    console.log("Album: " + data.tracks.items[0].album.name);
    consoleEnd();
  });
};
// TODO: movie-this function
function movieThis() {
  stringifyArgs();
  // Then run a request to the OMDB API with the movie specified
  userInquiry = userInquiry.split(' ').join('+');
  var queryUrl = "http://www.omdbapi.com/?t=" + userInquiry + "&y=&plot=short&apikey=trilogy";
  request(queryUrl, function(error, response, body) {
    // If the request is successful
    if (!error && response.statusCode === 200) {
      console.log(JSON.parse(body));
      consoleInit();
      console.log("Title: " + JSON.parse(body).Title)
      console.log("Release Year: " + JSON.parse(body).Year);
      consoleEnd();
    }
  });
};
// my-tweets function
function myTweets() {
  var params = {screen_name: 'liriDj'};
  client.get('statuses/user_timeline', params, function(error, tweets, response) {
  if (!error) {
    consoleInit();
    for(var i=0; i<tweets.length; i++) {
      var tweetDate = tweets[i].created_at;
      tweetDate = moment(tweetDate, "ddd MMM DD HH:mm:ss ZZ YYYY").toString();
      tweetDate = moment(tweetDate, "ddd MMM DD HH:mm:ss ZZ YYYY").format("MMM DD YYYY");
      console.log("Tweet from " + tweetDate + ": " + '"' + tweets[i].text + '"');
      console.groupCollapsed();
      console.groupEnd();
    }
    consoleEnd();
  };
});
};
// TODO: random function
function random() {
  // function here
};
// Stringify user arguments
function stringifyArgs() {
  // Loop through the process.argv arguments and push them to an array
  for(var i=3; i<args.length; i++) {
      userInquiry.push(args[i]);
  };
  // Combine the items of that array, adding spaces
  userInquiry = userInquiry.join(" ");
}
// Console beginning function
function consoleInit() {
  switch(command) {
    case "my-tweets":
      console.log("MY TWEETS!")
      break;
    case "spotify-this-song":
      console.log("SPOTIFY THIS SONG!")
      break;
    case "movie-this":
      console.log("MOVIE THIS!")
      break;
    case "do-what-it-says":
      console.log("LIRI'S CHOICE!")
      break;
  };
  console.warn("---------------------------------");
  console.log('Liri says:');
  console.groupCollapsed();
  console.groupCollapsed();
};
// Console end function
function consoleEnd() {
  console.groupEnd();
  console.groupEnd();
  console.warn("---------------------------------");
};
// Switch statement to handle the liri commands
switch(command) {
  case "my-tweets":
    myTweets();
    break;
  case "spotify-this-song":
    spotifyThis();
    break;
  case "movie-this":
    movieThis();
    break;
  case "do-what-it-says":
    random();
    break;
};
