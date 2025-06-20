import { BadRequestException, Injectable } from '@nestjs/common';
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
    const { conversationId, sender, content, responseId, ko_content } =
      createMessageDto;
    if (sender !== 'user' && sender !== 'assistant') {
      throw new BadRequestException('Invalid sender');
    }

    const message = this.messagesRepository.create({
      conversation: { id: conversationId },
      sender,
      content,
      responseId,
      ko_content,
    });
    return this.messagesRepository.save(message);
  }

  findAllByConversationId(conversationId: number) {
    return this.messagesRepository.find({
      where: { conversation: { id: conversationId } },
      order: { timestamp: 'ASC' },
    });
  }
}
