import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
} from 'class-validator';

const TIME_FORMAT = /^([01]\d|2[0-3]):[0-5]\d$/;

export class CreateTenantDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nameEn: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nameKm: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  descriptionEn?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  descriptionKm?: string;

  @IsInt()
  floor: number;

  @Matches(TIME_FORMAT, { message: 'openTime must be HH:mm' })
  openTime: string;

  @Matches(TIME_FORMAT, { message: 'closeTime must be HH:mm' })
  closeTime: string;

  @IsUUID()
  categoryId: string;
}
