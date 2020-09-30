import { CommonMessages } from '@constants/messages';
import { ValidationMessages } from '@constants/validation';
import { Token } from '@entities/token';
import { User } from '@entities/user';
import { AuthHelper } from '@utils/auth-helper';
import { CustomValidationError, UnauthorizedError } from '@utils/errors';
import { compare, hash } from 'bcryptjs';
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { TokenRepository } from './token.repository';
import { UserRepository } from './user.repository';

@Service()
export class UserService {
  private PASSWORD_HASH_SEED = 127;
  constructor(
    @InjectRepository()
    private readonly userRepository: UserRepository,
    @InjectRepository()
    private readonly tokenRepository: TokenRepository
  ) {}

  public async userExist(user: User): Promise<boolean> {
    const record = await this.userRepository.findByEmail(user.email);
    return record ? true : false;
  }

  public async create(user: User): Promise<User> {
    const recordExits = await this.userExist(user);
    if (recordExits) {
      throw new CustomValidationError(ValidationMessages.DUPLICATE_RECORD);
    }
    user.password = await hash(user.password, this.PASSWORD_HASH_SEED);
    return await this.userRepository.save(user);
  }

  public async me(email: string): Promise<User | undefined> {
    return await this.userRepository.findOne({ where: { email } });
  }

  public async login(email: string, password: string): Promise<object> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new CustomValidationError(ValidationMessages.USER_DOES_NOT_EXIST);
    }
    if (user && !user.active) {
      throw new CustomValidationError(ValidationMessages.USER_IS_INACTIVE);
    }
    const valid = await compare(password, user.password);
    if (!valid) {
      throw new CustomValidationError(ValidationMessages.PASSWORD_IS_INVALID);
    }
    return this.generateAndSaveTokens(user);
  }

  public async logout(refreshToken: string): Promise<void> {
    return await this.tokenRepository.removeToken(refreshToken);
  }

  public async refreshToken(refreshToken: string): Promise<object> {
    const decodedRefreshToken = AuthHelper.validateRefreshToken(refreshToken);
    if (decodedRefreshToken && decodedRefreshToken.user) {
      const user = await User.findOne({
        email: decodedRefreshToken.user.email,
      });
      if (
        !user ||
        user.tokenVersion !== decodedRefreshToken.user.tokenVersion
      ) {
        throw new UnauthorizedError(CommonMessages.ACCESS_DENIED);
      }
      if (user && !user.active) {
        throw new CustomValidationError(ValidationMessages.USER_IS_INACTIVE);
      } else {
        await this.tokenRepository.removeToken(refreshToken);
        return this.generateAndSaveTokens(user);
      }
    } else {
      throw new UnauthorizedError(CommonMessages.ACCESS_DENIED);
    }
  }

  private async generateAndSaveTokens(user: User): Promise<object> {
    const tokens = AuthHelper.getTokens(user);
    const token = new Token();
    token.email = user.email;
    token.access = tokens.accessToken;
    token.refresh = tokens.refreshToken;
    await this.tokenRepository.saveOrUpdate(token);
    return tokens;
  }

}
