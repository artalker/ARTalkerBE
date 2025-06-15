import { Controller, Get, Post, Body, Query } from '@nestjs/common';
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
  getResult(@Query('conversationId') conversationId: number) {
    return this.resultsService.getResult(conversationId);
  }
}
