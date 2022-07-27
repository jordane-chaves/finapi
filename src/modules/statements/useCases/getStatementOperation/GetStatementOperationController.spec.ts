import { Connection } from 'typeorm';
import request from 'supertest';

import { app } from '../../../../app';
import createConnection from '../../../../database';

let connection: Connection;

describe('GetStatementOperationController', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to get a statement operation', async () => {
    const user = {
      name: 'User Statement',
      email: 'user-statement-operation@test.com',
      password: 'statement-operation',
    };

    await request(app).post('/api/v1/users').send(user);
    const tokenResponse = await request(app).post('/api/v1/sessions').send(user);
    const { token } = tokenResponse.body;

    const newOperationResponse = await request(app)
      .post('/api/v1/statements/deposit')
      .send({ amount: 80, description: "Test Deposit Operation" })
      .set({ Authorization: `Bearer ${token}` });

    const operation = newOperationResponse.body;

    const response = await request(app)
      .get(`/api/v1/statements/${operation.id}`)
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body.amount).toEqual('80.00');
  });
});
