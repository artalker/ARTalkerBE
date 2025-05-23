import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessagesRepository } from './messages.repository';
import { Messages } from './entities/messages.entity';
import { OpenAIService } from '@src/openai/openai.service';
import { ConversationsRepository } from '@src/conversations/conversations.repository';
import { ArtworksRepository } from '@src/artworks/artworks.repository';

@Injectable()
export class MessagesService {
  constructor(
    private readonly messagesRepository: MessagesRepository,
    private readonly openAIService: OpenAIService,
    private readonly conversationsRepository: ConversationsRepository,
    private readonly artworksRepository: ArtworksRepository,
  ) {}

  // 사용자 메시지 생성 및 AI 응답 생성
  async createMessage(createMessageDto: CreateMessageDto): Promise<Messages> {
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

  private async generateAiResponse(conversationId: number): Promise<Messages> {
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

    // 이전 대화 내용 조회
    const previousMessages =
      await this.messagesRepository.findAllByConversationId(conversationId);
    const conversationHistory = previousMessages
      .map(
        (msg) => `${msg.sender === 'user' ? '사용자' : 'AI'}: ${msg.content}`,
      )
      .join('\n');

    const prompt = `
      당신은 미술 작품에 대해 대화하는 AI 튜터입니다.
      다음 작품에 대해 사용자 레벨 ${conversation.userLevel}에 맞는 대화를 이어가주세요:
      
      작품 정보:
      - 제목: ${artwork.title_ko}
      - 영문 제목: ${artwork.title_en}
      - 작가: ${artwork.artist}
      - 설명: ${artwork.description_ko}
      - 영문 설명: ${artwork.description_en}
      - 카테고리: ${artwork.category}
      - 제작년도: ${artwork.year}
      
      이전 대화 내용:
      ${conversationHistory}
      
      다음 지침을 따라주세요:
      1. 영문으로 대화를 이어가주세요.
      2. 이전 대화 내용을 고려하여 자연스럽게 대화를 이어가주세요.
      3. 사용자의 레벨에 맞는 어휘와 문법을 사용해주세요.
      4. 작품에 대한 새로운 정보나 관점을 제공해주세요.
      5. 사용자의 관심사나 질문에 집중해주세요.
      6. 대화가 너무 길어지지 않도록 적절한 길이로 응답해주세요.
      7. 응답 형식:
        - "AI:" 같은 라벨을 사용하지 마세요.
        - "Okay, great!" 같은 평가성 문구를 사용하지 마세요.
        - 자연스러운 대화체로 응답하세요.
        - 한 번에 너무 많은 정보를 제공하지 마세요.
        - 대화를 이어갈 수 있는 질문을 포함하세요.
      8. 응답 길이:
        - 2-3문장 정도의 간단한 정보 제공
        - 1개의 질문으로 대화 이어가기
        - 전체 응답은 4-5문장을 넘지 않도록 하세요.
    `;

    // const aiResponse = await this.openAIService.getCompletion(prompt);
    const aiResponse = await this.openAIService.getAIResponse(prompt);

    return this.messagesRepository.createMessage({
      conversationId,
      sender: 'ai',
      content: aiResponse.output_text || '',
      responseId: aiResponse.id || '',
    });
  }

  findAllByConversationId(conversationId: number) {
    return this.messagesRepository.findAllByConversationId(conversationId);
  }

  async generateInitialAiMessage(conversationId: number): Promise<Messages> {
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

    const prompt = `
  당신은 미술 작품에 대해 대화하는 AI 튜터입니다.
  다음 작품에 대해 사용자 레벨 ${conversation.userLevel}에 맞는 대화를 시작해주세요:
  
  작품 정보:
  - 제목: ${artwork.title_ko}
  - 영문 제목: ${artwork.title_en}
  - 작가: ${artwork.artist}
  - 설명: ${artwork.description_ko}
  - 영문 설명: ${artwork.description_en}
  - 카테고리: ${artwork.category}
  - 제작년도: ${artwork.year}
  
  다음 지침을 따라주세요:
  1. 영문으로 대화를 시작해주세요.
  2. 사용자의 레벨에 맞는 어휘와 문법을 사용해주세요.
  3. 응답 형식:
     - 3문장으로 구성: 소개 → 특징 → 질문
     - 자연스러운 대화체 사용
     - 한 번에 하나의 질문만 하기
  4. 금지사항:
     - "Okay, let's start..." 같은 시작 문구 사용 금지
     - "It's a famous painting" 같은 명백한 사실 언급 금지
     - 작품 제목 반복 언급 금지
`;

    // const aiResponse = await this.openAIService.getCompletion(prompt);
    const aiResponse = await this.openAIService.getAIResponse(prompt);

    return this.messagesRepository.createMessage({
      conversationId,
      sender: 'ai',
      content: aiResponse.output_text || '',
      responseId: aiResponse.id || '',
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
