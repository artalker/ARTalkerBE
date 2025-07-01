import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Conversation } from './entities/conversation.entity';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { SearchConversationDto } from './dto/search-conversation.dto';

@Injectable()
export class ConversationsRepository {
  private conversationsRepository: Repository<Conversation>;

  constructor(private readonly dataSource: DataSource) {
    this.conversationsRepository = this.dataSource.getRepository(Conversation);
  }

  // 대화 시작
  async createConversation(
    createConversationDto: CreateConversationDto,
  ): Promise<Conversation> {
    const { userId, artworkId, userLevel, difficulty } = createConversationDto;
    const conversation = this.conversationsRepository.create({
      user: { id: userId },
      artwork: { id: artworkId },
      userLevel,
      difficulty,
      isComplete: false,
      isDeleted: false,
      startedAt: new Date(),
    });
    return this.conversationsRepository.save(conversation);
  }

  async findAllConversationsByUserId(searchDto: SearchConversationDto) {
    const { page = 1, limit = 10, search, userId } = searchDto;
    const skip = (page - 1) * limit;

    const queryBuilder =
      this.conversationsRepository.createQueryBuilder('conversation');

    // artwork 정보를 함께 조회하기 위해 join 추가
    queryBuilder
      .leftJoinAndSelect('conversation.artwork', 'artwork')
      .leftJoin('conversation.rating', 'rating')
      .addSelect('rating.totalScoreStar')
      .where('conversation.isDeleted = :isDeleted', {
        isDeleted: false,
      });
    if (userId) {
      queryBuilder.andWhere('conversation.user.id = :userId', { userId });
    }

    if (search) {
      // queryBuilder 로 동적쿼리 생성
      queryBuilder.andWhere(
        '(artwork.title LIKE :search OR artwork.artist LIKE :search)', // Like 부분 일치 검색
        { search: `%${search}%` }, // % 와일드카드 앞뒤 일치 검색
      );
    }

    const [items, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('conversation.startedAt', 'DESC')
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
  async findConversationById(id: number): Promise<Conversation | null> {
    return this.conversationsRepository.findOne({
      where: { id },
      relations: ['artwork', 'user'],
    });
  }

  async updateConversation(
    id: number,
    updateConversationDto: UpdateConversationDto,
  ): Promise<Conversation | null> {
    await this.conversationsRepository.update(id, updateConversationDto);
    return this.findConversationById(id);
  }

  // 대화 종료
  async endConversation(id: number): Promise<Conversation | null> {
    // TODO: 대화 정보도 가져오기기 (messages)
    // TODO: 대화 결과 분석 및 저장 추가
    await this.conversationsRepository.update(id, {
      isComplete: true,
      endedAt: new Date(),
      updatedAt: new Date(),
    });
    return this.findConversationById(id);
  }

  async deleteConversation(id: number): Promise<Conversation | null> {
    await this.conversationsRepository.update(id, {
      isDeleted: true,
      deletedAt: new Date(),
    });
    return this.findConversationById(id);
  }
}
