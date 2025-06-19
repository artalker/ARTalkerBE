import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessagesRepository } from './messages.repository';
import { OpenAIService } from '@src/openai/openai.service';
import { ConversationsRepository } from '@src/conversations/conversations.repository';
import { ArtworksRepository } from '@src/artworks/artworks.repository';
import { getInitialPrompt, getAiResponsePrompt } from '@src/constants/prompt';

@Injectable()
export class MessagesService {
  constructor(
    private readonly messagesRepository: MessagesRepository,
    private readonly openAIService: OpenAIService,
    private readonly conversationsRepository: ConversationsRepository,
    private readonly artworksRepository: ArtworksRepository,
  ) {}

  // 사용자 메시지 생성 및 AI 응답 생성
  async createMessage(createMessageDto: CreateMessageDto) {
    try {
      // 1. 사용자 메시지 저장
      await this.messagesRepository.createMessage(createMessageDto);

      // 2. AI 응답 생성
      const aiMessage = await this.generateAiResponse(
        createMessageDto.conversationId,
      );

      return aiMessage;
    } catch (error) {
      throw new HttpException(
        '메시지 생성 실패: ' + (error as Error).message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // TODO: repository로 이동 or 분리할지 고려
  private async generateAiResponse(conversationId: number) {
    const conversation =
      await this.conversationsRepository.findConversationById(conversationId);
    if (!conversation) {
      throw new HttpException('대화를 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
    }

    const artwork = await this.artworksRepository.findOne(
      conversation.artwork.id,
    );
    if (!artwork) {
      throw new HttpException('작품을 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
    }

    // TODO: prompt constants로 이동 or 정리
    // 이전 대화 내용 조회 -> responseId 사용
    const previousMessages =
      await this.messagesRepository.findAllByConversationId(conversationId);
    console.log('previousMessages: ', previousMessages);

    const { responseId } = previousMessages[previousMessages.length - 1];
    console.log(
      'previousMessages[previousMessages.length - 1]: ',
      previousMessages[previousMessages.length - 1],
    );
    console.log('responseId: ', responseId);

    const prompt = getAiResponsePrompt({ conversation, artwork });

    // const aiResponse = await this.openAIService.getCompletion(prompt);
    const { id, output_text, ko_content } =
      await this.openAIService.getAIResponse(prompt, responseId);
    console.log('aiResponse: ', { id, output_text, ko_content });

    return this.messagesRepository.createMessage({
      conversationId,
      sender: 'assistant',
      content: output_text || '',
      ko_content: ko_content || '',
      responseId: id || '',
    });
  }

  findAllByConversationId(conversationId: number) {
    return this.messagesRepository.findAllByConversationId(conversationId);
  }

  async generateInitialAiMessage(conversationId: number) {
    const conversation =
      await this.conversationsRepository.findConversationById(conversationId);

    if (!conversation) {
      throw new HttpException('대화를 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
    }

    // 메시지 이력 확인
    const existingMessages =
      await this.messagesRepository.findAllByConversationId(conversationId);

    if (existingMessages.length !== 0) {
      throw new HttpException('이미 대화가 있습니다.', HttpStatus.BAD_REQUEST);
    }

    const artwork = await this.artworksRepository.findOne(
      conversation.artwork.id,
    );

    if (!artwork) {
      throw new HttpException('작품을 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
    }

    const prompt = getInitialPrompt({ conversation, artwork });

    // const aiResponse = await this.openAIService.getCompletion(prompt);
    const { id, output_text, ko_content } =
      await this.openAIService.getAIResponse(prompt, null);
    console.log('aiResponse: ', { id, output_text, ko_content });

    return this.messagesRepository.createMessage({
      conversationId,
      sender: 'assistant',
      content: output_text || '',
      ko_content: ko_content || '',
      responseId: id || '',
    });
  }

  findAll() {
    return `This action returns all messages`;
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageDto: any) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
