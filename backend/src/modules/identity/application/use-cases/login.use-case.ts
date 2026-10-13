import { Injectable } from '@nestjs/common';
import { UnauthorizedError } from '../../../../shared/domain/domain.error.js';
import { UseCase } from '../../../../shared/application/use-case.js';
import { UserRepository } from '../../domain/user.repository.js';
import { AccessTokenIssuer, IssuedAccessToken } from '../ports/access-token-issuer.js';
import { PasswordHasher } from '../ports/password-hasher.js';

export interface LoginInput {
  email: string;
  password: string;
}

@Injectable()
export class LoginUseCase implements UseCase<LoginInput, IssuedAccessToken> {
  constructor(
    private readonly users: UserRepository,
    private readonly hasher: PasswordHasher,
    private readonly tokens: AccessTokenIssuer,
  ) {}

  async execute({ email, password }: LoginInput): Promise<IssuedAccessToken> {
    const user = await this.users.findByEmail(email.trim().toLowerCase());
    const passwordMatches =
      user !== null && (await this.hasher.compare(password, user.password));

    if (!user || !passwordMatches) {
      throw new UnauthorizedError('Invalid email or password');
    }

    return this.tokens.issue({
      sub: user.id,
      email: user.email.value,
      role: user.role,
    });
  }
}
