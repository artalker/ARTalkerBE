import { Controller, Post, Body } from '@nestjs/common';
import { OpenAIService } from './openai.service';

@Controller('openai')
export class OpenAIController {
  constructor(private readonly openAIService: OpenAIService) {}

  @Post('completion')
  async getCompletion(@Body('prompt') prompt: string) {
    return this.openAIService.getCompletion(prompt);
  }

  @Post('response')
  async getAIResponse(
    @Body('content') content: string,
    @Body('responseId') responseId: string,
  ) {
    return this.openAIService.getAIResponse(content, responseId);
  }
}
