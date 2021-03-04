import UserToken from '@modules/users/infra/typeorm/entities/UserToken';
import IUsersTokenRepository from '@modules/users/repositories/IUsersTokenRepository';
import { v4 as uuid } from 'uuid';

class FakeUsersTokenRepository implements IUsersTokenRepository {
  private usersTokens: UserToken[] = [];

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = new UserToken();

    Object.assign(userToken, {
      id: uuid(),
      token: uuid(),
      user_id,
    });

    this.usersTokens.push(userToken);

    return userToken;
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const userToken = this.usersTokens.find((findToken) => findToken.token === token);

    return userToken;
  }
}

export default FakeUsersTokenRepository;