import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { ConversationsRepository } from './conversations.repository';

@Injectable()
export class ConversationsService {
  constructor(
    private readonly conversationsRepository: ConversationsRepository,
  ) {}

  create(createConversationDto: CreateConversationDto) {
    return this.conversationsRepository.createConversation(
      createConversationDto,
    );
  }

  findAll(userId: number) {
    return this.conversationsRepository.findAllConversationsByUserId(userId);
  }

  findOne(id: number) {
    return this.conversationsRepository.findConversationById(id);
  }

  update(id: number, updateConversationDto: UpdateConversationDto) {
    return this.conversationsRepository.updateConversation(
      id,
      updateConversationDto,
    );
  }

  remove(id: number) {
    // TODO: 대화 삭제시 레벨 업데이트 및 AI 대화 분석 결과 삭제
    return this.conversationsRepository.deleteConversation(id);
  }

  async endConversation(id: number) {
    const conversation =
      await this.conversationsRepository.findConversationById(id);

    if (!conversation) {
      throw new NotFoundException('대화를 찾을 수 없습니다.');
    }

    if (conversation.isComplete) {
      throw new BadRequestException('이미 종료된 대화입니다.');
    }
    // TODO: 대화 종료시 레벨 업데이트 및 AI 대화 분석 결과 저장
    return this.conversationsRepository.endConversation(id);
  }
}
