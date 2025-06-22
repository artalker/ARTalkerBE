import { Injectable } from '@nestjs/common';
import {
  DataSource,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { ConversationRating } from './entities/conversation_ratings.entity';
import { ConversationFeedback } from './entities/conversation_feedbacks.entity';
import { Conversation } from '../conversations/entities/conversation.entity';
import { EvaluationResult } from './dto/evaluation-result.dto';

// 통계 데이터 인터페이스 정의
export interface LearningStatistics {
  totalLearningTimeMinutes: number;
  completedLearningCount: number;
  uniqueTopicsCount: number;
  consecutiveLearningDays: number;
}

// TypeORM raw 쿼리 결과 타입 정의
interface TotalTimeQueryResult {
  totalMinutes: string;
}

interface UniqueTopicsQueryResult {
  uniqueTopics: string;
}

@Injectable()
export class ResultsRepository {
  private conversationRatingRepository: Repository<ConversationRating>;
  private conversationFeedbackRepository: Repository<ConversationFeedback>;
  private conversationRepository: Repository<Conversation>;
  constructor(private readonly dataSource: DataSource) {
    this.conversationRatingRepository =
      this.dataSource.getRepository(ConversationRating);
    this.conversationFeedbackRepository =
      this.dataSource.getRepository(ConversationFeedback);
    this.conversationRepository = this.dataSource.getRepository(Conversation);
  }

  async createRatingAndFeedback(
    ratings: Partial<ConversationRating>,
    feedback: Partial<ConversationFeedback>,
  ): Promise<{
    conversationRating: ConversationRating;
    conversationFeedback: ConversationFeedback;
  }> {
    // 기존 결과 확인 후 save
    const existingRating = await this.conversationRatingRepository.findOneBy({
      conversationId: ratings.conversationId,
    });
    const existingFeedback =
      await this.conversationFeedbackRepository.findOneBy({
        conversationId: feedback.conversationId,
      });

    const conversationRating = await this.conversationRatingRepository.save({
      ...ratings,
      ...(existingRating && { id: existingRating.id }),
    });
    const conversationFeedback = await this.conversationFeedbackRepository.save(
      {
        ...feedback,
        ...(existingFeedback && { id: existingFeedback.id }),
      },
    );

    return { conversationRating, conversationFeedback };
  }

  async findResultByConversationId(conversationId: number) {
    const result = await this.conversationRatingRepository.findOneBy({
      conversationId,
    });
    const feedback = await this.conversationFeedbackRepository.findOneBy({
      conversationId,
    });
    return { result, feedback };
  }

  // 연속 학습일 계산
  async getConsecutiveDays(userId: number): Promise<number> {
    // 모든 학습 날짜 가져오기
    const learningDates = await this.conversationRepository
      .createQueryBuilder('conversation')
      .select('DISTINCT DATE(conversation.startedAt)', 'learningDate')
      .where('conversation.isComplete = :isComplete', { isComplete: true })
      .andWhere('conversation.user = :userId', { userId })
      .orderBy('DATE(conversation.startedAt)', 'DESC')
      .getRawMany<{ learningDate: string }>();

    if (learningDates.length === 0) return 0;

    // 오늘 날짜 기준으로 연속일 계산
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let consecutiveDays = 0;
    const checkDate = new Date(today);

    // 학습 날짜들을 Set으로 변환 (빠른 검색)
    const learningDateSet = new Set(
      learningDates.map((item) => item.learningDate),
    );

    // 오늘부터 과거로 하루씩 확인 (최대 1000일까지)
    for (let i = 0; i < 1000; i++) {
      const dateString = checkDate.toISOString().split('T')[0];

      if (learningDateSet.has(dateString)) {
        consecutiveDays++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break; // 연속이 끊어지면 중단
      }
    }

    return consecutiveDays;
  }

  // TODO: 배치 고려, 최적화 방법 고려
  async getStatistics(userId: number): Promise<LearningStatistics> {
    try {
      // 모든 쿼리를 병렬로 실행
      const [
        totalLearningTimeResult,
        completedCount,
        uniqueTopicsResult,
        consecutiveDays,
      ] = await Promise.all([
        // 1. 총 학습시간 (분 단위)
        this.conversationRepository
          .createQueryBuilder('conversation')
          .select(
            'COALESCE(SUM(EXTRACT(EPOCH FROM (conversation.endedAt - conversation.startedAt)) / 60), 0)',
            'totalMinutes',
          )
          .where('conversation.isComplete = :isComplete', { isComplete: true })
          .andWhere('conversation.endedAt IS NOT NULL')
          .andWhere('conversation.user = :userId', { userId })
          .getRawOne<TotalTimeQueryResult>(),

        // 2. 완료된 학습 갯수
        this.conversationRepository.count({
          where: {
            isComplete: true,
            user: { id: userId },
          },
        }),

        // 3. 학습한 주제의 갯수 (고유 artwork 수)
        this.conversationRepository
          .createQueryBuilder('conversation')
          .select('COUNT(DISTINCT conversation.artwork)', 'uniqueTopics')
          .where('conversation.isComplete = :isComplete', { isComplete: true })
          .andWhere('conversation.user = :userId', { userId })
          .getRawOne<UniqueTopicsQueryResult>(),

        // 4. 연속 학습일 계산
        this.getConsecutiveDays(userId),
      ]);

      console.log('=== 총 학습시간(분) 계산 결과 ===');
      console.log('totalMinutes:', totalLearningTimeResult?.totalMinutes);

      const totalMinutes = parseInt(
        totalLearningTimeResult?.totalMinutes || '0',
      );
      const uniqueTopics = parseInt(uniqueTopicsResult?.uniqueTopics || '0');

      return {
        totalLearningTimeMinutes: totalMinutes,
        completedLearningCount: completedCount,
        uniqueTopicsCount: uniqueTopics,
        consecutiveLearningDays: consecutiveDays,
      };
    } catch (error) {
      console.error('통계 조회 중 오류 발생:', error);
      return {
        totalLearningTimeMinutes: 0,
        completedLearningCount: 0,
        uniqueTopicsCount: 0,
        consecutiveLearningDays: 0,
      };
    }
  }

  private getAverageSelectFields(type: 'week' | 'month'): string[] {
    const numericFields = [
      'totalScorePercentage',
      'totalScoreStar',
      'speechSentenceCount',
      'speechWordCount',
      'vocabBeginnerCount',
      'vocabIntermediateCount',
      'vocabAdvancedCount',
      'vocabDiversityCount',
      'vocabBeginnerRatio',
      'vocabIntermediateRatio',
      'vocabAdvancedRatio',
      'vocabDiversityScore',
      'sentenceAccuracyLowCount',
      'sentenceAccuracyMediumCount',
      'sentenceAccuracyHighCount',
      'sentenceAccuracyLowRatio',
      'sentenceAccuracyMediumRatio',
      'sentenceAccuracyHighRatio',
      'sentenceAccuracyScore',
      'expressBeginnerCount',
      'expressIntermediateCount',
      'expressAdvancedCount',
      'expressBeginnerRatio',
      'expressIntermediateRatio',
      'expressAdvancedRatio',
      'expressScore',
      'expressAppropriatenessScore',
      'expressCreativityScore',
    ];

    return [
      `DATE_TRUNC('${type}', conversation.startedAt) as period`,
      ...numericFields.map(
        (field) =>
          `ROUND(AVG(rating.${field}), 2) as avg${field.charAt(0).toUpperCase() + field.slice(1)}`,
      ),
      'COUNT(*) as totalSessions',
      `'${type}' as type`,
    ];
  }

  async getOverallEvaluation(
    userId: number,
    startDate: string,
    endDate: string,
    type: 'week' | 'month',
  ): Promise<EvaluationResult[] | ConversationRating[]> {
    if (type === 'week' || type === 'month') {
      return await this.conversationRatingRepository
        .createQueryBuilder('rating')
        .leftJoin('rating.conversation', 'conversation')
        .select(this.getAverageSelectFields(type))
        .where('conversation.user.id = :userId', { userId })
        .andWhere('conversation.startedAt >= :startDate', {
          startDate: new Date(startDate),
        })
        .andWhere('conversation.startedAt <= :endDate', {
          endDate: new Date(endDate),
        })
        .andWhere('conversation.isComplete = true')
        .groupBy(`DATE_TRUNC('${type}', conversation.startedAt)`)
        .orderBy('period', 'ASC')
        .getRawMany<EvaluationResult>();
    }

    // 기본: 개별 데이터 반환
    return await this.conversationRatingRepository.find({
      relations: ['conversation'],
      where: {
        conversation: {
          user: { id: userId },
          startedAt: MoreThanOrEqual(new Date(startDate)),
          endedAt: LessThanOrEqual(new Date(endDate)),
          isComplete: true,
        },
      },
      order: { conversation: { startedAt: 'ASC' } },
    });
  }
}
