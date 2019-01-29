require("dotenv").config();


var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var axios = require("axios");
var fs = require("fs");
var spotify = new Spotify(keys.spotify);
var request = require("request");
var moment = require('moment');
var userCommand = process.argv[3];
var liriCommands = process.argv[2];

// ------------------------------------------------------------------------------------
switch (liriCommands) {
    case "spotify-this-song":
        spotifyThisSong();
    break;

    case "movie-this":
            movieThis();
    break;

    
    case "concert-this":
         concertThis();
    break;

    case "do-what-it-says":
         doWhatItSays();
    break;

    default: console.log("\n" + "type any command after 'node liri.js':" + "\n" + 
    "spotify-this-song 'any song title' " + "\n" +
    "movie-this 'any movie title' " + "\n" +
    "do-what-it-says " + "\n" +
    "concert-this 'any concert title' " + "\n" +
    "use quotes for multiword titles!");
    
};

// ------------------------------------------------------------------------------------------------------------


// command spotify this song

function spotifyThisSong() {
var song = userCommand;
    if (!song) {
        song = "Ace of base"
    };

    spotify.search({
        type: 'track',
        query: song,
        limit: 1
    }, function (error, data) {
        if (error) {
            return console.log('Error occurred: ' + error);
        }
        let spotifyResponse = data.tracks.items;

        for (i = 0; i < spotifyResponse.length; i++) {

            var content = 
            "Artist:" + data.tracks.items[i].album.artists[0].name + "\nSong:" +  data.tracks.items[i].name  + "\nSpotify link:" + data.tracks.items[i].external_urls.spotify + "\nAlbum:" + data.tracks.items[i].album.name +'\n===================================';
           

            fs.appendFile("log.txt", content, function (err) {
                console.log(content);
            

            })
        };
    });
}

// ------------------------------------------------------------------------------------------------------------



// command movie this
function movieThis() {
    var movie = userCommand;

    axios.get("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&tomatoes=true&apikey=trilogy").then(
  function(response) {

      var output= "\nTitle:" + response.data.Title + "\nRelease Year: " + response.data.Year + "\nIMdB Rating: " + response.data.imdbRating +  "\nRotten Tomatoes Rating: " + response.data.Ratings[2].Value + "\nCountry: " + response.data.Country + "\nLanguage: " + response.data.Language + "\nPlot: " + response.data.Plot + "\nActors: " + response.data.Actors +'\n===================================';
      
      fs.appendFile("log.txt", output, function (err) {
        console.log(output);
    
  }
      )}
    )};
                 
    
// -------------------------------------------------------------------------------------------------

// command concert this
function concertThis() {
    var artist = userCommand;
    var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
   
    request(queryUrl, function(error, response, body) {
   
      if (!error && response.statusCode === 200) {
        var body = JSON.parse(body);
   
        if (body.length > 0) {
          for (i = 0; i < 1; i++) {
   
            var output = "Artist:" + body[i].lineup[0] + "\nVenue:" + body[i].venue.name + "\nVenue Location:" + body[i].venue.city + "," + body[i].venue.country + "\n" + moment(body[i].datetime).format("MM/DD/YYYY") + "\n===============================";
            console.log(output)
   
            fs.appendFile("log.txt", output, function(err) {
   
            });
   
          }
        } else {
          console.log('Band or concert not found!');
        }
   
      };
    });
   }

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (!error);
        console.log(data.toString());
        var cmds = data.toString().split(',');
    });
}



