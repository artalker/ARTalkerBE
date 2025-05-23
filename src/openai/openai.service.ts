import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class OpenAIService {
  private openRouter: OpenAI;
  private openai: OpenAI;

  constructor() {
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
  async getAIResponse(content: string) {
    try {
      const response = await this.openai.responses.create({
        model: 'gpt-4.1-nano-2025-04-14',
        input: [
          {
            role: 'user',
            content,
          },
        ],
      });
      console.log('response: ', response.output_text);
      return response;
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
}
