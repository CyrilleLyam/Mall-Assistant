import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  AccessTokenClaims,
  AccessTokenIssuer,
  IssuedAccessToken,
} from '../../application/ports/access-token-issuer.js';

export const DEFAULT_TOKEN_TTL_SECONDS = 3600;

@Injectable()
export class JwtAccessTokenIssuer extends AccessTokenIssuer {
  private readonly expiresIn: number;

  constructor(
    private readonly jwt: JwtService,
    config: ConfigService,
  ) {
    super();
    this.expiresIn = Number(
      config.get('JWT_EXPIRES_IN_SECONDS') ?? DEFAULT_TOKEN_TTL_SECONDS,
    );
  }

  async issue(claims: AccessTokenClaims): Promise<IssuedAccessToken> {
    const accessToken = await this.jwt.signAsync(
      { ...claims },
      { expiresIn: this.expiresIn },
    );
    return { accessToken, expiresIn: this.expiresIn };
  }
}
