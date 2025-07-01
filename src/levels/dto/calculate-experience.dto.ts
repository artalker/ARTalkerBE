import { IsNotEmpty, IsNumber, Min, Max } from 'class-validator';

export class CalculateExperienceDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(7)
  userLevel: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(7)
  conversationLevel: number;
}
