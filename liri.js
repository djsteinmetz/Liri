// Require a .env file containing API keys
require('dotenv').config();
const keys = require('./keys');
// require the node-packages
const Spotify = require('node-spotify-api');
const Twitter = require('twitter');
const request = require('request');
const fs = require('fs');
const moment = require('moment');
var command = process.argv[2];
var args = process.argv;
var userInquiry = [];
function spotifyThis() {
  var spotify = new Spotify(keys.spotify);
  stringifyArgs();
  if(!userInquiry) {
    userInquiry = "The Sign";
  };
  spotify.search({ type: 'track', query: userInquiry, limit: 1 }, function(err, data) {
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
function movieThis() {
  stringifyArgs();
  // Then run a request to the OMDB API with the movie specified
  userInquiry = userInquiry.split(' ').join('+');
  if(!userInquiry) {
    userInquiry = "Mr. Nobody";
  };
  var queryUrl = "http://www.omdbapi.com/?t=" + userInquiry + "&y=&plot=short&apikey=trilogy";
  request(queryUrl, function(error, response, body) {
    // If the request is successful
    if (!error && response.statusCode === 200) {
      var body = (JSON.parse(body));
      consoleInit();
      console.log(body.Title + ", " + body.Year);
      console.log("Ratings:");
      console.group()
      // Loop through ratings and log
      var ratings = body.Ratings
      for(var i=0; i<ratings.length; i++) {
        if(ratings[i].Source === "Internet Movie Database") {
          console.log(ratings[i].Source + ": " + ratings[i].Value);
        } else if(ratings[i].Source === "Rotten Tomatoes") { 
          console.log(ratings[i].Source + ": " + ratings[i].Value) 
        }
      };
      console.groupEnd();
      console.log("Country of production: " + body.Country);
      console.log("Language: " + body.Language);
      console.log("Actor(s): " + body.Actors);
      console.log("Plot: " + body.Plot);
      consoleEnd();
    }
  });
};
function myTweets() {
  var client = new Twitter(keys.twitter);
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
function random() {
  fs.readFile("random.txt", "utf8", function (error, data) {
    if (error) {
        return console.log(error);
    }
    var dataArray = data.split(",");
    console.log(dataArray[1])
    dataArray[1] = dataArray[1].split(" ");
    console.log(dataArray[1]);
    command = dataArray[0];
    userInquiry = dataArray[1];
    runApp();
});
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
function runApp() {
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
}
runApp();
