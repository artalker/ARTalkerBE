import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Messages } from './entities/messages.entity';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesRepository {
  private messagesRepository: Repository<Messages>;

  constructor(private readonly dataSource: DataSource) {
    this.messagesRepository = this.dataSource.getRepository(Messages);
  }

  async createMessage(createMessageDto: CreateMessageDto): Promise<Messages> {
    const { conversationId, sender, content, responseId } = createMessageDto;
    const message = this.messagesRepository.create({
      conversation: { id: conversationId },
      sender: sender as 'user' | 'ai',
      content,
      responseId,
    });
    return this.messagesRepository.save(message);
  }

  findAllByConversationId(conversationId: number) {
    return this.messagesRepository.find({
      where: { conversation: { id: conversationId } },
    });
  }
}
