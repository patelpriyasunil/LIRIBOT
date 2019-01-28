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
            console.log("Artist:" + data.tracks.items[i].album.artists[0].name + "\nSong:" +  data.tracks.items[i].name  + "\nSpotify link:" + data.tracks.items[i].external_urls.spotify + "\nAlbum:" + data.tracks.items[i].album.name +'\n===================================')
        };
    });
}

// ------------------------------------------------------------------------------------------------------------



// command movie this
function movieThis() {
    var movie = userCommand;

    axios.get("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&tomatoes=true&apikey=trilogy").then(
  function(response) {

            console.log("\nTitle:" + response.data.Title + "\nRelease Year: " + response.data.Year + "\nIMdB Rating: " + response.data.imdbRating +  "\nRotten Tomatoes Rating: " + response.data.Ratings[2].Value + "\nCountry: " + response.data.Country + "\nLanguage: " + response.data.Language + "\nPlot: " + response.data.Plot + "\nActors: " + response.data.Actors +'\n===================================');
  }
    )};
                 
    
// -------------------------------------------------------------------------------------------------

// command concert this
function concertThis() {
    var artist = userCommand;
    // Then run a request to the OMDB API with the movie specified
    var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    request(queryUrl, function (error, response, body) {
        // console.log(body);
        
        // If the request is successful = 200
        if (!error && response.statusCode === 200) {
            var body = JSON.parse(body);

            if (body.length > 0) {
                for (i = 0; i < 1; i++) {

                    console.log("Artist:" + body[i].lineup[0] +  "\nVenue:" + body[i].venue.name + "\nVenue Location:" + body[i].venue.city + "," +  body[i].venue.country)


                    let concertDate = moment(body[i].datetime).format("MM/DD/YYYY");
                    console.log("Date and Time:" + concertDate +'\n===================================');
                };
            } else {
                console.log('Band or concert not found!');
            };
        };
    });
};


function doWhatItSays() {
    //Read random.txt file
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (!error);
        console.log(data.toString());
        //split text with comma delimiter
        var cmds = data.toString().split(',');
    });
}



