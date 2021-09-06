CREATE TABLE movie (
    movie_id text primary key not null,
    title text, 
    original_title text,
    overview text
);

CREATE TABLE director (
    director_id text primary key not null,
    imdb_link text
);

CREATE TABLE movie_director (
    movie_id text primary key not null,
    director_id text primary key not null
);