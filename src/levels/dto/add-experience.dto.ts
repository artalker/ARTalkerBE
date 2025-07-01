import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  Min,
} from 'class-validator';

export class AddExperienceDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  experienceGained: number;

  @IsNotEmpty()
  @IsString()
  experienceType: string;

  @IsOptional()
  @IsNumber()
  conversationId?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  totalScore?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  difficulty?: number;

  @IsOptional()
  @IsString()
  bonusReason?: string;
}
