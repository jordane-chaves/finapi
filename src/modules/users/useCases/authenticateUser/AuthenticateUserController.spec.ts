import { Connection } from 'typeorm';
import request from 'supertest';

import { app } from '../../../../app';
import createConnection from '../../../../database';

let connection: Connection;

describe('AuthenticateUserController', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to authenticate user', async () => {
    const user = {
      name: "UserToAuthenticate",
      email: "user-auth@test.com",
      password: "test-auth-password"
    };

    await request(app).post('/api/v1/users').send(user);

    const response = await request(app).post('/api/v1/sessions').send({
      email: user.email,
      password: user.password
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should not be possible to authenticate a non-existent user', async () => {
    const response = await request(app).post('/api/v1/sessions').send({
      email: 'non-existent@user.com',
      password: 'non-existent',
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message');
  });
});
