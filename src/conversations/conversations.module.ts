import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationsService } from './conversations.service';
import { ConversationsController } from './conversations.controller';
import { ConversationsRepository } from './conversations.repository';
import { Conversation } from './entities/conversation.entity';
import { LevelsModule } from '@src/levels/levels.module';
import { ResultsModule } from '@src/results/results.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Conversation]),
    LevelsModule,
    ResultsModule,
  ],
  controllers: [ConversationsController],
  providers: [ConversationsService, ConversationsRepository],
})
export class ConversationsModule {}
