import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTipDto {
  @IsString()
  @IsNotEmpty()
  content: string;
}
