import { Connection } from 'typeorm';
import request from 'supertest';

import { ProfileMap } from '../../mappers/ProfileMap';
import { app } from '../../../../app';
import createConnection from '../../../../database';

let connection: Connection;

describe('ShowUserProfileController', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be possible to display the user's profile", async () => {
    const user = {
      name: 'User Profile Test',
      email: 'user-profile@test.com',
      password: 'profile-test-password',
    };

    await request(app).post('/api/v1/users').send(user);
    const tokenResponse = await request(app).post('/api/v1/sessions').send(user);

    const { token } = tokenResponse.body;

    const response = await request(app).get('/api/v1/profile').set({
      Authorization: `Bearer ${token}`,
    });

    const userProfile = ProfileMap.toDTO(response.body);

    expect(response.status).toBe(200);
    expect(userProfile).toHaveProperty('id');
    expect(userProfile.name).toEqual(user.name);
    expect(userProfile.email).toEqual(user.email);
  });

  it('should not be possible to display the profile of a non-existing user', async () => {
    const response = await request(app).get('/api/v1/profile').set({
      Authorization: `Bearer invalid-user-token`,
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message');
  });
});
