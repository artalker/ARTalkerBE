import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Conversation } from './entities/conversation.entity';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';

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
      startedAt: new Date(),
    });
    return this.conversationsRepository.save(conversation);
  }

  async findAllConversationsByUserId(userId: number): Promise<Conversation[]> {
    return this.conversationsRepository.find({
      where: { user: { id: userId } },
      relations: ['artwork'],
      order: {
        startedAt: 'DESC',
      },
    });
  }

  async findConversationById(id: number): Promise<Conversation | null> {
    return this.conversationsRepository.findOne({
      where: { id },
      relations: ['artwork'],
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

  async deleteConversation(id: number): Promise<void> {
    await this.conversationsRepository.delete(id);
  }
}
