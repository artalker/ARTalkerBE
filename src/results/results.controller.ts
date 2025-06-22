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

  @Get('overall-evaluation')
  async getOverallEvaluation(
    @Query('userId', ParseIntPipe) userId: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('type') type: 'week' | 'month',
  ) {
    return await this.resultsService.getOverallEvaluation({
      userId,
      startDate,
      endDate,
      type: type || 'week',
    });
  }
}
