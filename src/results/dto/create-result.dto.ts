import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateResultDto {
  @IsNotEmpty()
  @IsNumber()
  conversationId: number;
}
