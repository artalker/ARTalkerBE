import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationsService } from './conversations.service';
import { ConversationsController } from './conversations.controller';
import { ConversationsRepository } from './conversations.repository';
import { Conversation } from './entities/conversation.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Conversation])],
  controllers: [ConversationsController],
  providers: [ConversationsService, ConversationsRepository],
})
export class ConversationsModule {}
