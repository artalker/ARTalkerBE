import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { Messages } from './entities/messages.entity';
import { MessagesRepository } from './messages.repository';
import { ArtworksRepository } from '@src/artworks/artworks.repository';
import { ConversationsRepository } from '@src/conversations/conversations.repository';
import { Artwork } from '@src/artworks/entities/artwork.entity';
import { Conversation } from '@src/conversations/entities/conversation.entity';
import { OpenAIService } from '@src/openai/openai.service';
@Module({
  imports: [TypeOrmModule.forFeature([Messages, Artwork, Conversation])],
  controllers: [MessagesController],
  providers: [
    MessagesService,
    MessagesRepository,
    ArtworksRepository,
    ConversationsRepository,
    OpenAIService,
  ],
})
export class MessagesModule {}
