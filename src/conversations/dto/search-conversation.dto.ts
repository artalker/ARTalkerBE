import { PaginationDto } from '@src/common/dto/pagination.dto';
import { SearchDto } from '@src/common/dto/search.dto';
import { IntersectionType } from '@nestjs/mapped-types';
import { IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchConversationDto extends IntersectionType(
  PaginationDto,
  SearchDto,
) {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  userId?: number;
}
