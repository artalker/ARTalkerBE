import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ArtworksService } from './artworks.service';
import { CreateArtworkDto, CreateArtworksDto } from './dto/create-artwork.dto';
import { UpdateArtworkDto } from './dto/update-artwork.dto';
import { SearchArtworkDto } from './dto/search-artwork.dto';

@Controller('artworks')
export class ArtworksController {
  constructor(private readonly artworksService: ArtworksService) {}

  @Post()
  create(@Body() createArtworkDto: CreateArtworkDto) {
    return this.artworksService.create(createArtworkDto);
  }

  @Post('multiple')
  createBulk(@Body() createArtworksDto: CreateArtworksDto) {
    return this.artworksService.createArtworks(createArtworksDto);
  }

  @Get()
  findAll(@Query() searchDto: SearchArtworkDto) {
    return this.artworksService.findAll(searchDto);
  }

  @Get('today')
  getTodayArtworks() {
    return this.artworksService.getTodayArtworks();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.artworksService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArtworkDto: UpdateArtworkDto) {
    return this.artworksService.update(+id, updateArtworkDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.artworksService.remove(+id);
  }
}
