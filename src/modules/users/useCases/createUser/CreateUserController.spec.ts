import { Connection } from 'typeorm';
import createConnection from '../../../../database';

let connection: Connection;

describe('CreateUserController', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  it('test', () => {
    expect(1 + 1).toBe(2);
  });
});
