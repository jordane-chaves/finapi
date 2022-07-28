import { Connection } from 'typeorm';
import request from 'supertest';

import { app } from '../../../../app';
import createConnection from '../../../../database';

let connection: Connection;

describe('CreateUserController', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to create a new user', async () => {
    const response = await request(app).post('/api/v1/users')
      .send({
        name: "User supertest",
        email: "user@test.com",
        password: "test-password"
      });

    expect(response.status).toBe(201);
  });

  it('should not be able to create an already existing user', async () => {
    const user = {
      name: 'User repeated',
      email: 'user-repeated@test.com',
      password: 'repeated-password'
    };

    await request(app).post('/api/v1/users').send(user);

    const response = await request(app).post('/api/v1/users').send(user);

    expect(response.status).toBe(400);
  });
});
