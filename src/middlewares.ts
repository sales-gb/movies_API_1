import { NextFunction, Request, Response } from 'express';
import { QueryConfig, QueryResult } from 'pg';
import { IMovie } from './interfaces';
import { client } from './database';

const ensureMovieExists = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  const id: number = parseInt(req.params.id);

  const queryString: string = `
  SELECT * FROM movies 
  WHERE id = $1;
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult<IMovie> = await client.query(queryConfig);

  if (queryResult.rowCount === 0) {
    return res.status(404).json({ error: 'Movie not found!' });
  }

  res.locals.movie = queryResult.rows[0];

  return next();
};

export { ensureMovieExists };
