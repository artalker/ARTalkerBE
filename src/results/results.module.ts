import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResultsController } from './results.controller';
import { ResultsService } from './results.service';
import { ResultsRepository } from './results.repository';
import { Messages } from '../messages/entities/messages.entity';
import { Conversation } from '../conversations/entities/conversation.entity';
import { ConversationFeedback } from '../results/entities/conversation_feedbacks.entity';
import { ConversationRating } from '../results/entities/conversation_ratings.entity';
import { OpenAIService } from '../openai/openai.service';
import { ConversationsRepository } from '@src/conversations/conversations.repository';
import { MessagesRepository } from '@src/messages/messages.repository';
import { LevelsModule } from '@src/levels/levels.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Conversation,
      Messages,
      ConversationFeedback,
      ConversationRating,
    ]),
    LevelsModule,
  ],
  controllers: [ResultsController],
  providers: [
    ResultsService,
    ResultsRepository,
    OpenAIService,
    ConversationsRepository,
    MessagesRepository,
  ],
  exports: [ResultsService, ResultsRepository],
})
export class ResultsModule {}
