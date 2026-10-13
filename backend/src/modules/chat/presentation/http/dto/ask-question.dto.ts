import { IsString, MaxLength, MinLength } from 'class-validator';

export class AskQuestionDto {
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  question: string;
}
