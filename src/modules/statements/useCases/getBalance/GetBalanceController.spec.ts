import { Connection } from 'typeorm';
import request from 'supertest';

import { app } from '../../../../app';
import createConnection from '../../../../database';

let connection: Connection;

describe('GetBalanceController', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be possible to get the balance', async () => {
    const user = {
      name: 'User Balance',
      email: 'user-balance@test.com',
      password: 'user-balance-test-password',
    };

    await request(app).post('/api/v1/users').send(user);
    const tokenResponse = await request(app).post('/api/v1/sessions').send(user);
    const { token } = tokenResponse.body;

    const response = await request(app).get('/api/v1/statements/balance').set({
      Authorization: `Bearer ${token}`,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('statement');
    expect(response.body).toHaveProperty('balance');
  });

  it('should not be able to get the balance of the non-existing account', async () => {
    const response = await request(app).get('/api/v1/statements/balance').set({
      Authorization: `Bearer invalid-user-token`,
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message');
  });
});
