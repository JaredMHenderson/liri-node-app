const keys    = require("./keys.js");
const request = require("request");
const Twitter = require("twitter");
const Spotify = require("node-spotify-api");
var fs = require("fs");

let client = new Twitter({
    consumer_key: keys.consumer_key,
    consumer_secret: keys.consumer_secret,
    access_token_key: keys.access_token_key,
    access_token_secret: keys.access_token_secret
});

let spotify = new Spotify({
    id: "f3f09fd0ca6345fc881e30c7fd852b47",
    secret: "a0c4e3078926422bbad0a9a63baa2561"
});

//Function for My Tweets
let tweetMe = () => {
    client.get('statuses/user_timeline', { screen_name: 'jhenderson_DU', count: 20 }, function (error, tweets, response) {
        if (error) {
            console.log("error", error);
        }
        // console.log(tweets);
        tweets.forEach((tweet) => {
            console.log(`New tweet: ${tweet.text} - Created At: ${tweet.created_at}`);

            fs.appendFile("log.txt", `\n\nCurrent Tweets ${tweet.text}- Created At: ${tweet.created_at}`, function (err) {

                if (err) 
                {
                    console.log("err");
                }
                
            })
            
        });
        
    });
    
}

//Function for Spotify This Song
let spotifyMe = (song) => {
   
    spotify.search({ type: 'track', query: song }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        var songInfo = data.tracks.items[0];
        var info = (`
        ${songInfo.artists[0].name} 
        ${songInfo.name} 
        ${songInfo.album.name} 
        ${songInfo.preview_url}`);

        console.log(info);
       

        fs.appendFile("log.txt", `\n\nNew Song ${info}`, function (err) {

            if (err) {
                console.log("err");
            }
            console.log("Log Was Updated");
        })


    });
    
}
//Function for Movie This
let movieMe = () => {
    let movie = 'Mr. Nobody';
    if (process.argv[3]) {
        movie = process.argv.splice(3).join(" ");
    }
    request(`http://www.omdbapi.com/?t=${movie}&apikey=df3a4c67`, function (error, response, body) {

        // If the request is successful (i.e. if the response status code is 200)
        if (!error && response.statusCode === 200) {
            var info = (`
            * Movie Title - ${JSON.parse(body).Title} 
            * Year Released - ${JSON.parse(body).Year} 
            * imdb Rating - ${JSON.parse(body).imdbRating}
            * Rotten Tomatoes Rating - ${JSON.parse(body).Ratings[1].Value}
            * Country Where Film Was Produced - ${JSON.parse(body).Country}
            * Language of Film - ${JSON.parse(body).Language}
            * Plot - ${JSON.parse(body).Plot}
            * Actors - ${JSON.parse(body).Actors}`);

            console.log(info);

            fs.appendFile("log.txt", `\n\nNew Movie ${info}`, function (err) {

                if (err) {
                    console.log("err");
                }
                console.log("Log Was Updated");
            })
        }

    });
    
}


if(process.argv[2] === "my-tweets")
{
    tweetMe();
}  
    
else if(process.argv[2] === "spotify-this-song")
{
    spotifyMe(process.argv.splice(3).join(" "));
}
else if(process.argv[2] === "movie-this")
{
    movieMe();
}

else if (process.argv[2] === "do-what-it-says")
{
    fs.readFile("random.txt", 'utf8', function (err, data) {
        if (err) {
            console.log("Broken")
        }
        else {
            spotifyMe(data.split(' ').splice(1).join(' '));
        }

    })
}