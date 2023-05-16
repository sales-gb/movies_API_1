CREATE DATABASE entrega_s2_m4_movies;

-- Basic queries

-- create
INSERT INTO movies (name, category, duration, price)
VALUES ('Harry Potter e o Prisioneiro de Azkaban', 'Fantasia', '139', '50')
RETURNING *;

-- list
SELECT * FROM movies;

-- list by id
SELECT * FROM movies 
WHERE id = 1;

--update by id
UPDATE
  movies
SET(duration) =  ROW(140)
WHERE id = 1
RETURNING *;

-- delete by id 
DELETE FROM movies 
WHERE id = 2;

-- drop table for test
DROP TABLE movies;
