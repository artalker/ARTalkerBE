import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
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
    const { responseId } = createMessageDto;

    // ai의 응답 맥락을 유지하기 위해 responseId가 필요함
    if (!responseId) {
      throw new HttpException('responseId is required', HttpStatus.BAD_REQUEST);
    }

    return this.messagesService.createMessage(createMessageDto);
  }

  @Post('/initial/:conversationId')
  generateInitialAiMessage(@Param('conversationId') conversationId: string) {
    return this.messagesService.generateInitialAiMessage(+conversationId);
  }
}
