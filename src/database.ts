import { Client } from 'pg';

const client: Client = new Client({
  user: 'gb_sa',
  host: 'localhost',
  port: 5432,
  password: 'salinhodev',
  database: 'entrega_s2_m4_movies',
});

const startDatabase = async (): Promise<void> => {
  await client.connect();
  console.log('Database conected');
};

export { startDatabase, client };
