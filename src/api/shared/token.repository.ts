import { Token } from '@entities/token';
import { Service } from 'typedi';
import { EntityRepository, Repository } from 'typeorm';

@Service()
@EntityRepository(Token)
export class TokenRepository extends Repository<Token> {
  public async findByEmail(email: string): Promise<Token | undefined> {
    return await this.findOne({ email });
  }

  public async findByRefreshToken(
    refreshToken: string
  ): Promise<Token | undefined> {
    return await this.findOne({ refresh: refreshToken });
  }

  public async removeToken(refreshToken: string): Promise<void> {
    const tRecord = await this.findByRefreshToken(refreshToken);
    await tRecord?.remove();
    return;
  }

  public async saveOrUpdate(token: Token): Promise<Token | undefined> {
    const t1 = await this.findByEmail(token.email);
    if (t1) {
      Object.assign(t1, token);
      return await t1.save();
    } else {
      return await this.save(token);
    }
  }
}
