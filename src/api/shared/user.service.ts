import { User } from '@entities/user';
import { AuthHelper } from '@utils/auth-helper';
import { CustomValidationError } from '@utils/errors';
import { compare, hash } from 'bcryptjs';
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { UserRepository } from './user.repository';

@Service()
export class UserService {
  private PASSWORD_HASH_SEED = 15;
  // using constructor injection
  constructor(
    @InjectRepository()
    private readonly userRepository: UserRepository
  ) {}

  public async userExist(user: User): Promise<boolean> {
    const record = await this.userRepository.findByEmail(user.email);
    console.log('record', record);
    return record ? true : false;
  }

  public async create(user: User): Promise<User> {
    const recordExits = await this.userExist(user);
    if (recordExits) {
      throw new CustomValidationError('Duplicate record');
    }
    user.password = await hash(user.password, this.PASSWORD_HASH_SEED);
    return await this.userRepository.save(user);
  }

  public async login(email: string, password: string): Promise<object> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new CustomValidationError('User does not exist.');
    }
    if (user && !user.active) {
      throw new CustomValidationError('User is inactive.');
    }
    const valid = await compare(password, user.password);
    if (!valid) {
      throw new CustomValidationError('Password is invalid.');
    }
    const tokens = AuthHelper.setTokens(user);
    return tokens;
  }
}
