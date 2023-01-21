import request from 'supertest';
import { Express } from 'express-serve-static-core';
import createApp from '../app';
import knex from 'knex';
import path from 'path';
import util from 'util';
import { exec } from 'child_process';

let server: Express;
let db;

beforeAll(async () => {
  const schemaFilename = path.join(__dirname, '../../schema.sql');
  const dbFilename = path.join(__dirname, '../../db.test.sqlite');
  await util.promisify(exec)(`sqlite3 ${dbFilename} < ${schemaFilename}`);
  db = knex({
    client: 'sqlite3',
    connection: {
      filename: dbFilename
    },
    useNullAsDefault: true
  });
  server = createApp(db);
});

describe('POST /login', () => {
  it('should resolve with status code 400 when sent no payload', async () => {
    const response = await request(server).post(`/login`);

    expect(response.status).toEqual(400);
  });

  it('should resolve with status code 200 and profile data when username is in the payload', async () => {
    // NOTE: API accepts any username. Non-existing usernames are created on the
    const payload = { username: 'tester' };
    const response = await request(server).post(`/login`).send(payload);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      user: {
        id: 1,
        username: payload.username,
        cash: 150,
        pokemon_id: null
      }
    });
  });
});
