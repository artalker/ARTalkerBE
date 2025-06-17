import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateResultDto } from './dto/create-result.dto';
import { ResultsService } from './results.service';

@Controller('results')
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @Post()
  create(@Body() createResultDto: CreateResultDto) {
    return this.resultsService.create(createResultDto);
  }

  @Get()
  getConversationResult(@Query('conversationId') conversationId: number) {
    return this.resultsService.getConversationResult(conversationId);
  }

  @Get('statistics')
  async getStatistics(@Query('userId', ParseIntPipe) userId: number) {
    return await this.resultsService.getStatistics(userId);
  }
}
