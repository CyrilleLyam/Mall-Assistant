import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

const DATE_FORMAT = /^\d{4}-\d{2}-\d{2}$/;

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  titleEn: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  titleKm: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  descriptionEn?: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  descriptionKm?: string;

  @Matches(DATE_FORMAT, { message: 'startDate must be YYYY-MM-DD' })
  startDate: string;

  @Matches(DATE_FORMAT, { message: 'endDate must be YYYY-MM-DD' })
  endDate: string;
}
