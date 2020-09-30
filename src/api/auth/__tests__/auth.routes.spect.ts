import { CommonConstants } from '@constants/common';
import { CommonMessages } from '@constants/messages';
import { ValidationMessages } from '@constants/validation';
import { StatusCodes } from 'http-status-codes';
import supertest from 'supertest';

import App from '../../../../server';

const endPointURI = '/api/v1/auth';

let request;
const userDetails = {
  fullName: 'test user',
  email: 'test.user@test.com',
  password: 'Test123456',
};

const loginDetails = {
  username: userDetails.email,
  password: userDetails.password,
};

beforeAll(async (done) => {
  const appInstance = new App();
  await appInstance.dbSetup();
  request = supertest.agent(appInstance.app);
  // create test data
  await request.post('/api/v1/sign-up').send(userDetails);
  done();
});

describe('Authentication API', () => {
  describe('✅ Success scenarios', () => {
    describe('Login', () => {
      it('should login successfully', async () => {
        const res = await request
          .post(`${endPointURI}/login`)
          .expect('set-cookie', /access/)
          .expect('set-cookie', /refresh/)
          .send(loginDetails);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toBeDefined();
        expect(res.header['set-cookie'].length).toBeGreaterThanOrEqual(2);
        expect(res.body).toHaveProperty(CommonConstants.ACCESS_TOKEN);
        expect(res.body).toHaveProperty(CommonConstants.REFRESH_TOKEN);
      });
    });

    describe('Me', () => {
      it('should respond with logged in user details', async () => {
        const res = await request.post(`${endPointURI}/me`).send(loginDetails);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toBeDefined();
        expect(res.body).toHaveProperty('email');
        expect(res.body).toHaveProperty('fullName');
        expect(res.body).toHaveProperty('lastLoggedIn');
      });
    });

    describe('Refresh Token', () => {
      it('should respond with updated access and refresh token', async () => {
        const res = await request
          .post(`${endPointURI}/refreshToken`)
          .expect('set-cookie', /access/)
          .expect('set-cookie', /refresh/)
          .send(loginDetails);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toBeDefined();
        expect(res.body).toHaveProperty(CommonConstants.ACCESS_TOKEN);
        expect(res.body).toHaveProperty(CommonConstants.REFRESH_TOKEN);
      });
    });

    describe('Logout', () => {
      it('should logout user successfully', async () => {
        const res = await request
          .delete(`${endPointURI}/logout`)
          .send(loginDetails);

        expect(res.status).toBe(StatusCodes.NO_CONTENT);
      });
    });
  });

  describe('❌ Failure scenarios', () => {
    describe('Login', () => {
      it('should not be able to login with invalid credentials', async () => {
        const res = await request
          .post(`${endPointURI}/login`)
          .send({ ...loginDetails, username: 'dummy@test.com' });
        expect(res.status).toBe(StatusCodes.CONFLICT);
        expect(res.body).toBeDefined();
        expect(res.body).toHaveProperty('status');
        expect(res.body.message).toBe(ValidationMessages.USER_DOES_NOT_EXIST);
      });
    });

    describe('Me', () => {
      it('should not be able to access me api', async () => {
        const res = await request
          .post(`${endPointURI}/me`)
          .set('Cookie', [])
          .send();
        expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
        expect(res.body).toBeDefined();
        expect(res.body).toHaveProperty('status');
        expect(res.body.message).toBe(CommonMessages.ACCESS_DENIED);
      });
    });

    describe('Refresh Token', () => {
      it('should not be able to access refresh token api without cookies', async () => {
        const res = await request
          .post(`${endPointURI}/refreshToken`)
          .set('Cookie', [])
          .send();
        expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
        expect(res.body).toBeDefined();
        expect(res.body).toHaveProperty('status');
        expect(res.body.message).toBe(CommonMessages.ACCESS_DENIED);
      });
    });
  });
});
