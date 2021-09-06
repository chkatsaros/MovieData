# MovieData
An application that uses the API from The Movie DB and stores movie information. This application is written in Javascript and uses Postgres as the database.

### Build
A basic web application that listens to port 3000. It is build in express - nodejs and uses postgres as the database to store the information that it retrieves in each GET="/" via the api from TMDB. The data are update every time the user uses http://localhost:3000. The project will be continued with Docker containers anytime soon. There will be two images, one for the database and one for the server. After that will be optimized using a third image, Redis, for the purpose of caching the database.

### Core Technologies
- Express <br>
- Axios <br>
- PG

### How to run
To run the application:
- npm start
- remember that the MovieData app uses port 3000
- ready to go!
