import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ResultsRepository } from './results.repository';
import { CreateResultDto } from './dto/create-result.dto';
import { ConversationsRepository } from '@src/conversations/conversations.repository';
import { OpenAIService } from '@src/openai/openai.service';
import { LevelsService } from '@src/levels/levels.service';
@Injectable()
export class ResultsService {
  constructor(
    private readonly resultsRepository: ResultsRepository,
    private readonly conversationsRepository: ConversationsRepository,
    private readonly openAIService: OpenAIService,
    private readonly levelsService: LevelsService,
  ) {}

  // conversation 학습 결과 생성
  async create(createResultDto: CreateResultDto) {
    const { conversationId } = createResultDto;
    const conversation =
      await this.conversationsRepository.findConversationById(conversationId);
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    if (!conversation.isComplete) {
      throw new BadRequestException('Conversation is not complete');
    }

    const ratingAndFeedback =
      await this.openAIService.createRatingAndFeedback(conversationId);

    if (!ratingAndFeedback) {
      throw new BadRequestException('Failed to create rating and feedback');
    }

    const { ratings, feedback } = ratingAndFeedback;
    console.log(' ratings, feedback: ', ratings, feedback);

    try {
      const totalScoreStar = Math.round(ratings.totalScorePercentage / 20);

      const result = await this.resultsRepository.createRatingAndFeedback(
        { ...ratings, conversationId, totalScoreStar },
        { ...feedback, conversationId },
      );

      // 경험치는 endConversation에서 이미 지급됨 (중복 지급 방지)
      // TODO: 나중에 경험치 로그에 점수 정보 업데이트 기능 추가 가능

      return result;
    } catch (error) {
      console.error('Error in create: ', error);
      throw error;
    }
  }

  // conversation 학습결과 조회
  async getConversationResult(conversationId: number) {
    const { result, feedback } =
      await this.resultsRepository.findResultByConversationId(conversationId);
    return { result, feedback };
  }

  // 총 학습통계 데이터
  async getStatistics(userId: number) {
    const statistics = await this.resultsRepository.getStatistics(userId);
    return statistics;
  }

  async getOverallEvaluation({
    userId,
    startDate,
    endDate,
    type,
  }: {
    userId: number;
    startDate: string;
    endDate: string;
    type: 'day' | 'week' | 'month';
  }) {
    return await this.resultsRepository.getOverallEvaluation(
      userId,
      startDate,
      endDate,
      type,
    );
  }
}
