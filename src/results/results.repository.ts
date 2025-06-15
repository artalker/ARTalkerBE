import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ConversationRating } from './entities/conversation_ratings.entity';
import { ConversationFeedback } from './entities/conversation_feedbacks.entity';
import { Conversation } from '../conversations/entities/conversation.entity';

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

  async getStatistics() {}
}
