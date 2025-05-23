import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested } from 'class-validator';

export class CreateArtworkDto {
  @IsString()
  title: string;

  @IsString()
  title_en: string;

  @IsString()
  title_ko: string;

  @IsString()
  artist: string;

  @IsString()
  description_en: string;

  @IsString()
  description_ko: string;

  @IsString()
  imageUrl: string;

  @IsString()
  category: string;

  @IsString()
  year: string;
}

export class CreateArtworksDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateArtworkDto)
  artworks: CreateArtworkDto[];
}
