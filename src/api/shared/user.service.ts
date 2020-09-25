import { User } from '@entities/user';
import { CustomValidationError } from '@utils/errors';
import { hash } from 'bcryptjs';
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
    return (await this.userRepository.findByEmail(user.email)) ? true : false;
  }

  public async create(user: User): Promise<User> {
    if (this.userExist(user)) {
      throw new CustomValidationError('Duplicate record');
    }
    user.password = await hash(user.password, this.PASSWORD_HASH_SEED);
    return await this.userRepository.save(user);
  }
}
