import { Module } from '@nestjs/common';
import { OpenAIService } from './openai.service';
import { OpenAIController } from './openai.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationFeedback } from '@src/results/entities/conversation_feedbacks.entity';
import { ConversationRating } from '@src/results/entities/conversation_ratings.entity';
import { MessagesRepository } from '@src/messages/messages.repository';
import { Messages } from '@src/messages/entities/messages.entity';
import { ConversationsRepository } from '@src/conversations/conversations.repository';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      ConversationFeedback,
      ConversationRating,
      Messages,
    ]),
  ],
  controllers: [OpenAIController],
  providers: [OpenAIService, MessagesRepository, ConversationsRepository],
  exports: [OpenAIService],
})
export class OpenAIModule {}
