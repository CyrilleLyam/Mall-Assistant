import { IsOptional, IsString, MaxLength } from 'class-validator';

export class GetTenantQuery {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  q?: string;
}
