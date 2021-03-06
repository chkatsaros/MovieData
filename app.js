const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { Client } = require('pg');
require('dotenv/config');

const app = express();

const API_KEY = process.env.API_KEY;
const DB = process.env.DB;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const PORT = process.env.PORT;
const HOST = process.env.HOST;

const regionToQuery = 'GR';

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

            let movieQuery = {
                text: `INSERT INTO movie(movie_id, title, original_title, description)values($1, $2, $3, $4)`,
                values: [movie.id, movie.title, movie.original_title, movie.overview]
            };
            client.query(movieQuery, (err, res) => {
                if (err) {
                    console.log(err.message);
                }
                client.end;
            });

            const credits = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${API_KEY}`);
            const crew = credits.data.crew;
            
            for (member of crew) {
                if (member.job === "Director") {

                    let movieDirectorQuery = {
                        text: `INSERT INTO movie_director(movie_id, director_id)values($1, $2)`,
                        values: [movie.id, member.id]
                    };
                    client.query(movieDirectorQuery, (err, res) => {
                        if (err) {
                            console.log(err.message);
                        }
                        client.end;
                    });

                    const director = await axios.get(`https://api.themoviedb.org/3/person/${member.id}?api_key=${API_KEY}`);
                    const directorIMDB = director.data.imdb_id;

                    let directorQuery = {
                        text: `INSERT INTO director(director_id, imdb_link)values($1, $2)`,
                        values: [member.id, `https://www.imdb.com/name/${directorIMDB}/`]
                    };
                    client.query(directorQuery, (err, res) => {
                        if (err) {
                            console.log(err.message);
                        }
                        client.end;
                    });
                }
            }
        }

        //Return nowPlaying movies in Greek Theaters
        res.send(movieData);
    }
    catch (err) {
        res.status(404).send(err);
    }
});

//Connect to the DB
const client = new Client({
    host: HOST,
    user: DB_USER,
    port: PORT,
    password: DB_PASSWORD,
    database: DB
});
client.connect();

//Listen to the Server
app.listen(3000, '0.0.0.0');