const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { Client } = require('pg');
require('dotenv/config');

const app = express();
const API_KEY = process.env.API_KEY;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const regionToQuery = 'GR';

const client = new Client({
    host: "localhost",
    user: DB_USER,
    port: 5432,
    password: DB_PASSWORD,
    database: "postgres"
});
client.connect();

client.query(`Select * from film`, (err, res) => {
    if (!err) {
        console.log(res.rows);
    }
    else {
        console.log(err.message);
    }
    client.end;
});

//Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Routes
app.get('/', async (req, res) => {
    try {
        const nowPlaying = await axios.get(`https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&region=${regionToQuery}`);
        const movieData = nowPlaying.data.results;

        for (movie of movieData) {
            const credits = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${API_KEY}`);
            const crew = credits.data.crew;
            //console.log(crew);
            for (member of crew) {
                if (member.job === "Director") {
                    const director = await axios.get(`https://api.themoviedb.org/3/person/${member.id}?api_key=${API_KEY}`);
                    const directorIMDB = director.data.imdb_id;
                    console.log(`https://www.imdb.com/name/${directorIMDB}/`);
                }
            }
        }

        res.send(movieData);
    }
    catch (err) {
        res.status(404).send(err);
    }
});

//Connect to database


//Listen to the Server
app.listen(3000, '0.0.0.0');

// API CALL
// Playing now in Greece: https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&region=${regionToQuery}
// Get movie by id: https://api.themoviedb.org/3/movie/${movieID}?api_key=${API_KEY}
// IMDB Link: https://www.imdb.com/title/${imdbId}
// Director from crew[i].job == "Director": https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${API_KEY}
// Get person particularly imdb_id: https://api.themoviedb.org/3/person/${crew[i].id}?api_key=${API_KEY}
// His imdb profile is: https://www.imdb.com/name/${directorID}/

