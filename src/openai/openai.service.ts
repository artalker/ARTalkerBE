import { Injectable, NotFoundException } from '@nestjs/common';
import OpenAI from 'openai';
import { ConversationsRepository } from '@src/conversations/conversations.repository';
import { MessagesRepository } from '@src/messages/messages.repository';
import {
  aiResponseSchema,
  resultSchema,
} from '@src/constants/aiResponseSchema';
import { zodTextFormat } from 'openai/helpers/zod';
import { systemPrompt } from '@src/constants/prompt';

@Injectable()
export class OpenAIService {
  private openRouter: OpenAI;
  private openai: OpenAI;

  constructor(
    private readonly conversationsRepository: ConversationsRepository,
    private readonly messagesRepository: MessagesRepository,
  ) {
    // OpenRouter
    this.openRouter = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: process.env.OPENROUTER_API_KEY,
      defaultHeaders: {
        'HTTP-Referer': process.env.SITE_URL,
        'X-Title': process.env.SITE_NAME,
      },
    });

    // OpenAI ChatGPT
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  // Response API version (OpenAI ChatGPT)
  async getAIResponse(content: string, responseId: string | null) {
    try {
      const { id, output_parsed } = await this.openai.responses.parse({
        model: 'gpt-4.1-nano-2025-04-14',
        input: [
          {
            role: 'user',
            content,
          },
        ],
        previous_response_id: responseId,
        text: {
          format: zodTextFormat(aiResponseSchema, 'aiResponse'),
        },
      });
      console.log('response: ', { id, ...output_parsed });
      return { id, ...output_parsed };
    } catch (error) {
      console.error('Error in getCompletion: ', error);
      throw error;
    }
  }

  // Deprecated
  // Completion API version (OpenRouter)
  async getCompletion(prompt: string) {
    try {
      const completion = await this.openRouter.chat.completions.create({
        // model: 'deepseek/deepseek-chat-v3-0324:free',
        model: 'google/gemini-2.0-flash-exp:free',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });
      console.log('completion: ', completion.choices[0].message);
      return completion.choices[0].message;
    } catch (error) {
      console.error('Error in getCompletion: ', error);
      throw error;
    }
  }

  async createRatingAndFeedback(conversationId: number) {
    const conversation =
      await this.conversationsRepository.findConversationById(conversationId);
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    const messages =
      await this.messagesRepository.findAllByConversationId(conversationId);
    console.log('messages: ', messages);

    try {
      const { output_parsed } = await this.openai.responses.parse({
        model: 'gpt-4.1-nano-2025-04-14',
        input: [
          {
            role: 'system',
            content: systemPrompt,
          },
          ...messages.map((message) => ({
            role: message.sender,
            content: message.content,
          })),
        ],

        text: {
          format: zodTextFormat(resultSchema, 'result'),
        },
      });

      console.log('output_parsed: ', output_parsed);
      return output_parsed;
    } catch (error) {
      console.error('Error in createRatingAndFeedback: ', error);
      throw error;
    }
  }
}
