import { Connection } from 'typeorm';
import request from 'supertest';

import { app } from '../../../../app';
import createConnection from '../../../../database';

let connection: Connection;

describe('CreateStatementController', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to make a deposit', async () => {
    const user = {
      name: 'User Deposit',
      email: 'user-deposit@test.com',
      password: 'password-deposit',
    };

    await request(app).post('/api/v1/users').send(user);
    const tokenResponse = await request(app).post('/api/v1/sessions').send(user);
    const { token } = tokenResponse.body;

    const response = await request(app)
      .post('/api/v1/statements/deposit')
      .send({ amount: 100, description: "Test deposit" })
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.amount).toEqual(100);
  });
});
