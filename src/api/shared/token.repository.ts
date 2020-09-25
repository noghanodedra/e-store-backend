import { Token } from '@entities/token';
import { Service } from 'typedi';
import { EntityRepository, Repository } from 'typeorm';

@Service()
@EntityRepository(Token)
export class TokenRepository extends Repository<Token> {
  public findByEmail(email: string): Promise<Token | undefined> {
    return this.findOne({ email });
  }
}
