import express, { Application, json } from 'express';
import {
  addMovie,
  deleteMovie,
  showMovieById,
  showMovies,
  updateMovie,
} from './logic';
import { startDatabase } from './database';
import { ensureMovieExists } from './middlewares';

const app: Application = express();
app.use(json());

app.post('/movies', addMovie);
app.get('/movies', showMovies);
app.get('/movies/:id', ensureMovieExists, showMovieById);
app.patch('/movies/:id', ensureMovieExists, updateMovie);
app.delete('/movies/:id', ensureMovieExists, deleteMovie);

const PORT: number = 3000;
const runningMsg: string = `Server is running on http://localhost:${PORT}`;
app.listen(PORT, async () => {
  await startDatabase();
  console.log(runningMsg);
});
