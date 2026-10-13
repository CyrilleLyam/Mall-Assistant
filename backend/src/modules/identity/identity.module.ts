import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessTokenIssuer } from './application/ports/access-token-issuer.js';
import { PasswordHasher } from './application/ports/password-hasher.js';
import { LoginUseCase } from './application/use-cases/login.use-case.js';
import { UserRepository } from './domain/user.repository.js';
import { TypeOrmUserRepository } from './infrastructure/persistence/typeorm-user.repository.js';
import { UserOrmEntity } from './infrastructure/persistence/user.orm-entity.js';
import { BcryptPasswordHasher } from './infrastructure/security/bcrypt-password-hasher.js';
import { JwtAccessTokenIssuer } from './infrastructure/security/jwt-access-token-issuer.js';
import { JwtStrategy } from './infrastructure/security/jwt.strategy.js';
import { AuthController } from './presentation/http/auth.controller.js';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
      }),
    }),
    TypeOrmModule.forFeature([UserOrmEntity]),
  ],
  controllers: [AuthController],
  providers: [
    LoginUseCase,
    JwtStrategy,
    { provide: UserRepository, useClass: TypeOrmUserRepository },
    { provide: PasswordHasher, useClass: BcryptPasswordHasher },
    { provide: AccessTokenIssuer, useClass: JwtAccessTokenIssuer },
  ],
})
export class IdentityModule {}
