const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv/config');
//const { promisify } = require('util');

const app = express();
const API_KEY = process.env.API_KEY;
const regionToQuery = 'GR';

//Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Routes
app.get('/', async (req, res) => {
    const fetched = await axios.get(`https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&region=${regionToQuery}`);
    const movieData = fetched.data.results;

    res.json(movieData);
    //res.send('YAY we are on home page of MovieData!');
});

//Connect to database


//Listen to the Server
app.listen(3000, '0.0.0.0');

// API CALL
// Playing now in Greece: https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&region=${regionToQuery}
// Get movie by id: https://api.themoviedb.org/3/movie/${movieID}?api_key=${API_KEY}
// IMDB Link: https://www.imdb.com/title/${imdbId}