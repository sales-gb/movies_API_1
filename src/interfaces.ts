interface IMovie {
  id: number;
  name: string;
  category: string;
  duration: number;
  price: number;
}

type TMovieRequest = Omit<IMovie, 'id'>;

export { IMovie, TMovieRequest };
