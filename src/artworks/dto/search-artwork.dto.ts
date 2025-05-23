import { PaginationDto } from '@src/common/dto/pagination.dto';
import { SearchDto } from '@src/common/dto/search.dto';
import { IntersectionType } from '@nestjs/mapped-types';

// IntersectionType은 NestJS에서 제공하는 유틸리티로,
// 여러 DTO 클래스의 속성들을 하나의 DTO로 합치는 기능
export class SearchArtworkDto extends IntersectionType(
  PaginationDto,
  SearchDto,
) {}
