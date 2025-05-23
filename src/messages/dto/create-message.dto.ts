export class CreateMessageDto {
  conversationId: number;
  sender: string;
  content: string;
  responseId: string;
}
