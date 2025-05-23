import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateConversationDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  artworkId: number;

  @IsNotEmpty()
  @IsNumber()
  userLevel: number;

  @IsNotEmpty()
  @IsNumber()
  difficulty: number;
}
