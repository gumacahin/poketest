import createApp from './app';
import dotenv from 'dotenv';
import knex from 'knex';

// initialize configuration
dotenv.config();

const port = process.env.SERVER_PORT; // default port to listen

const db = knex({
  client: 'sqlite3',
  connection: {
    filename: `./${process.env.DATABASE}`
  },
  useNullAsDefault: true
});

const app = createApp(db);

// start the Express server
app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${port}`);
});
