import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { ApiEnvelopeResponse } from '../../../../shared/presentation/http/api-envelope-response.decorator.js';
import { LoginUseCase } from '../../application/use-cases/login.use-case.js';
import { LoginDto } from './dto/login.dto.js';
import { LoginResponse } from './dto/login.response.js';

@ApiTags('auth')
@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post('login')
  @HttpCode(200)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @ApiEnvelopeResponse(LoginResponse)
  login(@Body() body: LoginDto): Promise<LoginResponse> {
    return this.loginUseCase.execute(body);
  }
}
