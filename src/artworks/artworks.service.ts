import { Injectable } from '@nestjs/common';
import { CreateArtworkDto, CreateArtworksDto } from './dto/create-artwork.dto';
import { UpdateArtworkDto } from './dto/update-artwork.dto';
import { SearchArtworkDto } from './dto/search-artwork.dto';
import { ArtworksRepository } from './artworks.repository';

@Injectable()
export class ArtworksService {
  constructor(private readonly artworksRepository: ArtworksRepository) {}
  create(createArtworkDto: CreateArtworkDto) {
    return this.artworksRepository.createArtwork(createArtworkDto);
  }

  async createArtworks(createArtworksDto: CreateArtworksDto) {
    return this.artworksRepository.createArtworks(createArtworksDto);
  }

  findAll(searchDto: SearchArtworkDto) {
    return this.artworksRepository.findAll(searchDto);
  }

  findOne(id: number) {
    return this.artworksRepository.findOne(id);
  }

  getTodayArtworks() {
    return this.artworksRepository.getTodayArtwork();
  }

  update(id: number, updateArtworkDto: UpdateArtworkDto) {
    return `This action updates a #${id} artwork`;
  }

  remove(id: number) {
    return `This action removes a #${id} artwork`;
  }
}
