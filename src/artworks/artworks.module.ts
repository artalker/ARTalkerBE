import { Module } from '@nestjs/common';
import { ArtworksService } from './artworks.service';
import { ArtworksController } from './artworks.controller';
import { Artwork } from './entities/artwork.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtworksRepository } from './artworks.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Artwork])],
  controllers: [ArtworksController],
  providers: [ArtworksService, ArtworksRepository],
})
export class ArtworksModule {}
