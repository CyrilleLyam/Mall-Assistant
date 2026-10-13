import { UnauthorizedError } from '../../../../shared/domain/domain.error.js';
import { User } from '../../domain/user.entity.js';
import { UserRepository } from '../../domain/user.repository.js';
import { AccessTokenIssuer } from '../ports/access-token-issuer.js';
import { PasswordHasher } from '../ports/password-hasher.js';
import { LoginUseCase } from './login.use-case.js';

class InMemoryUsers extends UserRepository {
  constructor(private readonly users: User[]) {
    super();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email.value === email) ?? null;
  }

  async save(user: User): Promise<void> {
    this.users.push(user);
  }
}

class ReversingHasher extends PasswordHasher {
  async hash(plain: string): Promise<string> {
    return plain.split('').reverse().join('');
  }

  async compare(plain: string, stored: string): Promise<boolean> {
    return (await this.hash(plain)) === stored;
  }
}

class FixedTokenIssuer extends AccessTokenIssuer {
  async issue() {
    return { accessToken: 'token', expiresIn: 3600 };
  }
}

describe('LoginUseCase', () => {
  const admin = User.create({
    email: 'admin@mall.test',
    password: 'terces',
    role: 'admin',
  });
  const login = new LoginUseCase(
    new InMemoryUsers([admin]),
    new ReversingHasher(),
    new FixedTokenIssuer(),
  );

  it('issues a token for valid credentials', async () => {
    await expect(
      login.execute({ email: ' Admin@Mall.test ', password: 'secret' }),
    ).resolves.toEqual({ accessToken: 'token', expiresIn: 3600 });
  });

  it('rejects a wrong password', async () => {
    await expect(
      login.execute({ email: 'admin@mall.test', password: 'wrong' }),
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it('rejects an unknown email', async () => {
    await expect(
      login.execute({ email: 'nobody@mall.test', password: 'secret' }),
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });
});
