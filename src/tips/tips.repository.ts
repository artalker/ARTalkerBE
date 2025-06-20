import { Injectable } from '@nestjs/common';
import { Between, DataSource, Repository } from 'typeorm';
import { Tip } from './entities/tip.entity';
import { CreateTipDto } from './dto/create-tip.dto';
import { SearchTipDto } from './dto/search-tip.dto';

@Injectable()
export class TipsRepository {
  private tipsRepository: Repository<Tip>;

  constructor(private readonly dataSource: DataSource) {
    this.tipsRepository = this.dataSource.getRepository(Tip);
  }

  async createTip(createTipDto: CreateTipDto) {
    const tip = this.tipsRepository.create({
      content: createTipDto.content,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return this.tipsRepository.save(tip);
  }

  async getTodayTips() {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    return this.tipsRepository.find({
      where: {
        createdAt: Between(startOfDay, endOfDay),
      },
      take: 1,
    });
  }

  async searchTips(searchDto: SearchTipDto) {
    const { page = 1, limit = 10, search } = searchDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.tipsRepository.createQueryBuilder('tip');

    if (search) {
      // queryBuilder 로 동적쿼리 생성
      queryBuilder.andWhere(
        '(tip.content LIKE :search)', // Like 부분 일치 검색
        { search: `%${search}%` }, // % 와일드카드 앞뒤 일치 검색
      );
    }

    const [items, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('tip.createdAt', 'DESC')
      .getManyAndCount();

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
}
