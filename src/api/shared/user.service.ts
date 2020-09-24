import { User } from '@entities/User';
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { UserRepository } from './user.repository';

@Service()
export class UserService {
  // using constructor injection
  constructor(
    @InjectRepository()
    private readonly userRepository: UserRepository
  ) {}

  public async userExist(user: User): Promise<boolean> {
    return (await this.userRepository.findByEmail(user.email)) ? true : false;
  }

  public async create(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

}
