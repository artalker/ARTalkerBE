import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

// PartialType을 사용하여 CreateUserDto의 모든 속성을 선택적(optional)으로 만듬
export class UpdateUserDto extends PartialType(CreateUserDto) {}
