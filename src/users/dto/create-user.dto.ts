import { Min, IsInt, Max, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  profileImage: string;

  @IsInt()
  @Min(1)
  @Max(7)
  level: number;

  @IsInt()
  @Min(0)
  experience: number;
}
