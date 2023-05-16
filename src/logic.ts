import { Request, Response } from 'express';
import { client } from './database';
import { QueryConfig, QueryResult } from 'pg';
import { IMovie, TMovieRequest } from './interfaces';
import format from 'pg-format';

const addMovie = async (req: Request, res: Response): Promise<Response> => {
  const movieData: TMovieRequest = req.body;

  const nameMovieQuery: string = `
  SELECT * FROM movies WHERE name = $1
  `;

  const ensureMovieExistRes: QueryResult<IMovie> = await client.query(
    nameMovieQuery,
    [movieData.name],
  );
  if (ensureMovieExistRes.rowCount > 0) {
    return res.status(409).json({ error: 'Movie name already exists!' });
  }

  const queryString: string = format(
    `
    INSERT INTO 
      movies 
        (%I)
    VALUES 
        (%L)
    RETURNING *;
  `,
    Object.keys(movieData),
    Object.values(movieData),
  );

  const queryResult: QueryResult<IMovie> = await client.query(queryString);

  return res.status(201).json(queryResult.rows[0]);
};

const showMovies = async (req: Request, res: Response): Promise<Response> => {
  const category: any = req.query.category;

  let queryString: string = ``;
  let queryResult: QueryResult<IMovie>;

  if (category) {
    queryString = `
      SELECT * FROM movies
      WHERE category = $1;
    `;
    const queryConfig: QueryConfig = {
      text: queryString,
      values: [category],
    };
    queryResult = await client.query(queryConfig);

    if (queryResult.rowCount === 0) {
      queryString = `
      SELECT * FROM movies;
      `;
      queryResult = await client.query(queryString);
    }
  } else {
    queryString = `
      SELECT * FROM movies;
      `;
    queryResult = await client.query(queryString);
  }

  return res.json(queryResult.rows);
};

const showMovieById = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const movie: IMovie = res.locals.movie;

  return res.json(movie);
};

const updateMovie = async (req: Request, res: Response): Promise<Response> => {
  const movieData: Partial<TMovieRequest> = req.body;
  const id: number = parseInt(req.params.id);

  const nameMovieQuery: string = `
  SELECT * FROM movies WHERE name = $1
  `;

  const ensureMovieExistRes: QueryResult<IMovie> = await client.query(
    nameMovieQuery,
    [movieData.name],
  );
  if (ensureMovieExistRes.rowCount > 0) {
    return res.status(409).json({ error: 'Movie name already exists!' });
  }

  const queryString: string = format(
    `
    UPDATE
      movies
    SET(%I) =  ROW(%L)
    WHERE id = $1
    RETURNING *;
    `,
    Object.keys(movieData),
    Object.values(movieData),
  );

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult<IMovie> = await client.query(queryConfig);

  return res.json(queryResult.rows[0]);
};

const deleteMovie = async (req: Request, res: Response): Promise<Response> => {
  const id: number = parseInt(req.params.id);

  const queryString: string = `
    DELETE FROM 
      movies 
    WHERE id = $1;
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  await client.query(queryConfig);

  return res.status(204).send();
};

export { addMovie, showMovies, showMovieById, updateMovie, deleteMovie };
