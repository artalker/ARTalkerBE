import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get(':conversationId')
  findAllByConversationId(@Param('conversationId') conversationId: string) {
    return this.messagesService.findAllByConversationId(+conversationId);
  }

  @Post()
  create(@Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.createMessage(createMessageDto);
  }

  @Post('/initial/:conversationId')
  generateInitialAiMessage(@Param('conversationId') conversationId: string) {
    return this.messagesService.generateInitialAiMessage(+conversationId);
  }
}
