import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ConversationRating } from './entities/conversation_ratings.entity';
import { ConversationFeedback } from './entities/conversation_feedbacks.entity';

@Injectable()
export class ResultsRepository {
  private conversationRatingRepository: Repository<ConversationRating>;
  private conversationFeedbackRepository: Repository<ConversationFeedback>;
  constructor(private readonly dataSource: DataSource) {
    this.conversationRatingRepository =
      this.dataSource.getRepository(ConversationRating);
    this.conversationFeedbackRepository =
      this.dataSource.getRepository(ConversationFeedback);
  }

  async createRatingAndFeedback(
    ratings: Partial<ConversationRating>,
    feedback: Partial<ConversationFeedback>,
  ): Promise<{
    conversationRating: ConversationRating;
    conversationFeedback: ConversationFeedback;
  }> {
    const conversationRating =
      await this.conversationRatingRepository.save(ratings);
    const conversationFeedback =
      await this.conversationFeedbackRepository.save(feedback);
    return { conversationRating, conversationFeedback };
  }

  // async createConversationRating(
  //   conversationRating: ConversationRating,
  // ): Promise<ConversationRating> {
  //   return this.conversationRatingRepository.save(conversationRating);
  // }

  // async createConversationFeedback(
  //   conversationFeedback: ConversationFeedback,
  // ): Promise<ConversationFeedback> {
  //   return this.conversationFeedbackRepository.save(conversationFeedback);
  // }
}
