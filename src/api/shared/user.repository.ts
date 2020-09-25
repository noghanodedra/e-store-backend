import { User } from '@entities/user';
import { Service } from 'typedi';
import { EntityRepository, Repository } from 'typeorm';

@Service()
@EntityRepository(User)
export class UserRepository extends Repository<User> {

  public findByEmail(email: string): Promise<User | undefined> {
    return this.findOne({ email });
  }

}
