import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { OpenAIController } from '@src/openai/openai.controller';
import { Messages } from './entities/messages.entity';
import { MessagesRepository } from './messages.repository';
import { ArtworksRepository } from '@src/artworks/artworks.repository';
import { ConversationsRepository } from '@src/conversations/conversations.repository';
import { Artwork } from '@src/artworks/entities/artwork.entity';
import { Conversation } from '@src/conversations/entities/conversation.entity';
import { OpenAIModule } from '@src/openai/openai.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Messages, Artwork, Conversation]),
    OpenAIModule,
  ],
  controllers: [MessagesController, OpenAIController],
  providers: [
    MessagesService,
    MessagesRepository,
    ArtworksRepository,
    ConversationsRepository,
  ],
})
export class MessagesModule {}
