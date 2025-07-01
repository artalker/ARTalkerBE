import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { ConversationsRepository } from './conversations.repository';
import { SearchConversationDto } from './dto/search-conversation.dto';
import { LevelsService } from '@src/levels/levels.service';
import { ResultsRepository } from '@src/results/results.repository';

@Injectable()
export class ConversationsService {
  constructor(
    private readonly conversationsRepository: ConversationsRepository,
    private readonly levelsService: LevelsService,
    private readonly resultsRepository: ResultsRepository,
  ) {}

  create(createConversationDto: CreateConversationDto) {
    return this.conversationsRepository.createConversation(
      createConversationDto,
    );
  }

  findAll(searchDto: SearchConversationDto) {
    return this.conversationsRepository.findAllConversationsByUserId(searchDto);
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
    console.log(`Conversation ${id} removal requested - not implemented`);
    // return this.conversationsRepository.deleteConversation(id);
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

    // 대화 종료 처리
    const endedConversation =
      await this.conversationsRepository.endConversation(id);

    // 대화 완료 시 경험치 지급 (result 생성 여부와 무관)
    if (conversation.user) {
      try {
        // 경험치 계산 (유저 레벨, 대화 난이도를 비교하여 가중치 부여)
        const experienceData =
          this.levelsService.calculateConversationExperience(
            conversation.userLevel,
            conversation.difficulty,
          );

        // 경험치 지급
        const levelResult = await this.levelsService.addExperience(
          conversation.user.id,
          experienceData.experience,
          'conversation_complete',
          id,
          conversation.difficulty,
          experienceData.breakdown.join(', '),
        );

        return {
          ...endedConversation,
          experienceGained: experienceData.experience,
          levelUp: levelResult.levelUp,
          experienceBreakdown: experienceData.breakdown,
          oldLevel: levelResult.oldLevel,
          newLevel: levelResult.newLevel,
        };
      } catch (error) {
        console.error('경험치 지급 중 오류:', error);
        // 경험치 지급 실패해도 대화 종료는 성공으로 처리
      }
    }

    return endedConversation;
  }

  async deleteConversation(id: number) {
    const conversation =
      await this.conversationsRepository.findConversationById(id);

    if (!conversation) {
      throw new NotFoundException('대화를 찾을 수 없습니다.');
    }
    return this.conversationsRepository.deleteConversation(id);
  }
}
