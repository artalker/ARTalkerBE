import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationsService } from './conversations.service';
import { ConversationsController } from './conversations.controller';
import { ConversationsRepository } from './conversations.repository';
import { Conversation } from './entities/conversation.entity';
import { Messages } from '../messages/entities/messages.entity';
import { ConversationFeedback } from './entities/conversation_feedbacks.entity';
import { ConversationRating } from './entities/conversation_ratings.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Conversation,
      Messages,
      ConversationFeedback,
      ConversationRating,
    ]),
  ],
  controllers: [ConversationsController],
  providers: [ConversationsService, ConversationsRepository],
})
export class ConversationsModule {}
