import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Artwork } from './entities/artwork.entity';
import { CreateArtworkDto, CreateArtworksDto } from './dto/create-artwork.dto';
import { UpdateArtworkDto } from './dto/update-artwork.dto';
import { SearchArtworkDto } from './dto/search-artwork.dto';

@Injectable()
export class ArtworksRepository {
  private artworksRepository: Repository<Artwork>;

  constructor(private readonly dataSource: DataSource) {
    this.artworksRepository = this.dataSource.getRepository(Artwork);
  }

  async createArtwork(createArtworkDto: CreateArtworkDto): Promise<Artwork> {
    const {
      title,
      title_en,
      title_ko,
      artist,
      description_en,
      description_ko,
      imageUrl,
      category,
      year,
    } = createArtworkDto;
    const artwork = this.artworksRepository.create({
      title,
      title_en,
      title_ko,
      artist,
      description_en,
      description_ko,
      imageUrl,
      category,
      year,
    });
    return this.artworksRepository.save(artwork);
  }

  async createArtworks(
    createArtworksDto: CreateArtworksDto,
  ): Promise<Artwork[]> {
    const { artworks } = createArtworksDto;
    const artworkEntities = artworks.map((artwork) =>
      this.artworksRepository.create(artwork),
    );
    return this.artworksRepository.save(artworkEntities);
  }

  async findOne(id: number): Promise<Artwork | null> {
    return this.artworksRepository.findOneBy({ id });
  }

  async findAll(searchDto: SearchArtworkDto) {
    const { page = 1, limit = 10, search } = searchDto;
    const skip = (page - 1) * limit; //건너뛸 레코드 수 계산산

    const queryBuilder = this.artworksRepository.createQueryBuilder('artwork');

    if (search) {
      // queryBuilder 로 동적쿼리 생성
      queryBuilder.where(
        '(artwork.title LIKE :search OR artwork.artist LIKE :search)', // Like 부분 일치 검색색
        { search: `%${search}%` }, // % 와일드카드 앞뒤 일치 검색
      );
    }

    const [items, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('artwork.id', 'DESC')
      .getManyAndCount(); // 데이터 조회 및 총 개수 반환

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        search,
      },
    };
  }
  async updateArtwork(
    id: number,
    updateArtworkDto: UpdateArtworkDto,
  ): Promise<Artwork | null> {
    await this.artworksRepository.update(id, updateArtworkDto);
    return this.findOne(id);
  }
}
