import { ValidationMessages } from '@constants/validation';
import supertest from 'supertest';

import App from '../../../../server';

let request;
const userDetails = {
  fullName: 'test user',
  email: 'test.user@test.com',
  password: 'Test123456',
};

beforeAll(async (done) => {
  const appInstance = new App();
  await appInstance.dbSetup();
  request = supertest(appInstance.app);
  done();
});

describe('Sign Up API', () => {
  const endPointURI = '/api/v1/sign-up';
  describe('✅ Success scenarios', () => {
    it('should create a new user', async () => {
      const res = await request.post(endPointURI).send(userDetails);
      expect(res.status).toBe(201);
      expect(res.body).toBeDefined();
      expect(res.body).toHaveProperty('email');
      expect(res.body.fullName).toBe(userDetails.fullName);
    });
  });

  describe('❌ Failure scenarios', () => {
    it('should not allow to create a duplicate user', async () => {
      const res = await request.post(endPointURI).send(userDetails);
      expect(res.status).toBe(409);
      expect(res.body).toBeDefined();
      expect(res.body).toHaveProperty('status');
      expect(res.body.message).toBe(ValidationMessages.DUPLICATE_RECORD);
    });

    it('should not allow to create a user with empty firstName, email, password', async () => {
      const res = await request
        .post(endPointURI)
        .send({ email: '', fullName: '', password: '' });
      expect(res.status).toBe(409);
      expect(res.body).toBeDefined();
      expect(res.body).toHaveProperty('fullName');
      expect(res.body).toHaveProperty('email');
      expect(res.body).toHaveProperty('password');
      expect(res.body.fullName.message).toMatch(/(empty)/i);
      expect(res.body.email.message).toMatch(/(empty)/i);
      expect(res.body.password.message).toMatch(/(empty)/i);
    });

    it('should not allow to create a user with invalid email', async () => {
      const res = await request
        .post(endPointURI)
        .send({ ...userDetails, email: 'test' });
      expect(res.status).toBe(409);
      expect(res.body).toBeDefined();
      expect(res.body).toHaveProperty('email');
      expect(res.body.email.message).toMatch(/(valid)/i);
    });

    it('should not allow to create a user with invalid password', async () => {
      const res = await request
        .post(endPointURI)
        .send({ ...userDetails, password: 'test' });
      expect(res.status).toBe(409);
      expect(res.body).toBeDefined();
      expect(res.body).toHaveProperty('password');
      expect(res.body.password.message).toMatch(/(upper|lower|number)/i);
    });
  });
});
