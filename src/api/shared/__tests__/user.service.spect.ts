import { CommonConstants } from '@constants/common';
import { Token } from '@entities/token';
import { User } from '@entities/user';
import { TokenRepository } from '@shared/token.repository';
import { UserRepository } from '@shared/user.repository';
import { UserService } from '@shared/user.service';
import { AuthHelper } from '@utils/auth-helper';
import bcrypt from 'bcryptjs';
import { Container } from 'typedi';

jest.mock('typeorm-typedi-extensions', () => ({
  // tslint:disable-next-line: no-empty
  InjectRepository: () => () => {},
}));

let userService: UserService;

const user: User = new User();
user.active = true;
user.fullName = 'test9';
user.email = 'dummy@user.com';
user.password = 'Test1234567';

beforeAll(async () => {
  userService = Container.get(UserService);
});

describe('User Service', () => {
  describe('when creating a user', () => {
    it('should return a persisted user', async () => {
      UserRepository.prototype.findByEmail = jest.fn((a) =>
        Promise.resolve(undefined)
      );
      jest
        .spyOn(UserRepository.prototype, 'save')
        .mockResolvedValueOnce(Promise.resolve(user));

      const resp = await userService.create(user);

      expect(typeof resp).toEqual('object');
      expect(resp).toHaveProperty('email');
    });

    it('should return throw error if user already exists', async () => {
      UserRepository.prototype.findByEmail = jest.fn((a) =>
        Promise.resolve(user)
      );
      await expect(userService.create(user)).rejects.toThrow(/Duplicate/);
    });
  });

  describe('when login a user', () => {
    it('should return tokens for valid user details', async () => {
      jest
        .spyOn(UserRepository.prototype, 'findOne')
        .mockResolvedValueOnce(Promise.resolve(user));

      jest
        .spyOn(TokenRepository.prototype, 'findOne')
        .mockResolvedValueOnce(Promise.resolve(undefined));

      jest
        .spyOn(TokenRepository.prototype, 'save')
        .mockResolvedValueOnce(Promise.resolve(new Token()));

      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation((a, b) => Promise.resolve(true));

      const resp = await userService.login(user.email, user.password);

      expect(typeof resp).toEqual('object');
      expect(resp).toHaveProperty(CommonConstants.ACCESS_TOKEN);
      expect(resp).toHaveProperty(CommonConstants.REFRESH_TOKEN);
    });

    it('should throw error if user does not exist', async () => {
      jest
        .spyOn(UserRepository.prototype, 'findOne')
        .mockResolvedValueOnce(Promise.resolve(undefined));

      await expect(userService.login('test', 'password')).rejects.toThrow(
        /not/
      );
    });

    it('should throw error if user is inactive', async () => {
      jest
        .spyOn(UserRepository.prototype, 'findOne')
        .mockResolvedValueOnce(
          Promise.resolve(Object.assign({}, user, { active: false }))
        );

      await expect(
        userService.login(user.email, user.password)
      ).rejects.toThrow(/inactive/);
    });

    it('should throw error if password is invalid', async () => {
      jest
        .spyOn(UserRepository.prototype, 'findOne')
        .mockResolvedValueOnce(Promise.resolve(user));

      jest
        .spyOn(TokenRepository.prototype, 'findOne')
        .mockResolvedValueOnce(Promise.resolve(undefined));
      jest
        .spyOn(TokenRepository.prototype, 'save')
        .mockResolvedValueOnce(Promise.resolve(new Token()));

      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation((a, b) => Promise.resolve(false));

      await expect(
        userService.login(user.email, user.password)
      ).rejects.toThrow(/invalid/);
    });
  });

  describe('when calling me', () => {
    it('should return a logged in user', async () => {
      jest
        .spyOn(UserRepository.prototype, 'findOne')
        .mockResolvedValueOnce(Promise.resolve(user));

      const resp = await userService.me(user.email);

      expect(typeof resp).toEqual('object');
      expect(resp).toHaveProperty('email');
    });
  });

  describe('when calling logout', () => {
    it('should remove token from db', async () => {
      TokenRepository.prototype.removeToken = jest.fn();

      await userService.logout(user.email);

      expect(TokenRepository.prototype.removeToken).toHaveBeenCalled();
    });
  });

  describe('when calling refreshToken', () => {
    it('should throw error if token is invalid', async () => {
      await expect(userService.refreshToken('test')).rejects.toThrow(/denied/);
    });

    it('should throw error if user is inactive', async () => {
      jest
        .spyOn(UserRepository.prototype, 'findOne')
        .mockResolvedValueOnce(
          Promise.resolve(Object.assign({}, user, { active: false }))
        );
      await expect(userService.refreshToken('test')).rejects.toThrow(/denied/);
    });

    it('should refresh token if user is valid', async () => {
      jest
        .spyOn(UserRepository.prototype, 'findOne')
        .mockResolvedValueOnce(
          Promise.resolve(Object.assign({}, user, { tokenVersion: 0 }))
        );
      jest
        .spyOn(TokenRepository.prototype, 'saveOrUpdate')
        .mockResolvedValueOnce(Promise.resolve(new Token()));
      AuthHelper.validateRefreshToken = jest.fn((a) => ({
        user: { ...user, tokenVersion: 0 },
      }));
      TokenRepository.prototype.removeToken = jest.fn();

      const resp = await userService.refreshToken('test');

      expect(resp).toBeDefined();
      expect(typeof resp).toEqual('object');
      expect(resp).toHaveProperty(CommonConstants.ACCESS_TOKEN);
      expect(resp).toHaveProperty(CommonConstants.REFRESH_TOKEN);
    });
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});
