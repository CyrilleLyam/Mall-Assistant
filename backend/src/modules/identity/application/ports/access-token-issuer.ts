import { UserRole } from '../../domain/user-role.js';

export interface AccessTokenClaims {
  sub: string;
  email: string;
  role: UserRole;
}

export interface IssuedAccessToken {
  accessToken: string;
  expiresIn: number;
}

export abstract class AccessTokenIssuer {
  abstract issue(claims: AccessTokenClaims): Promise<IssuedAccessToken>;
}
