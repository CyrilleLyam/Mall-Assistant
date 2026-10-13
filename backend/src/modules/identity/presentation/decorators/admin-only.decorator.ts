import { applyDecorators, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserRole } from '../../domain/user-role.js';
import { JwtAuthGuard } from '../guards/jwt-auth.guard.js';
import { RolesGuard } from '../guards/roles.guard.js';
import { Roles } from './roles.decorator.js';

export const AdminOnly = () =>
  applyDecorators(
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles(UserRole.Admin),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Missing or invalid token' }),
    ApiForbiddenResponse({ description: 'Admin role required' }),
  );
