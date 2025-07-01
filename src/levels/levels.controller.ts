import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { LevelsService } from './levels.service';
import { AddExperienceDto } from './dto/add-experience.dto';
import { CalculateExperienceDto } from './dto/calculate-experience.dto';

@Controller('levels')
export class LevelsController {
  constructor(private readonly levelsService: LevelsService) {}

  @Get()
  async getAllLevels() {
    return this.levelsService.getAllLevels();
  }

  @Get('user/:userId')
  async getUserLevel(@Param('userId', ParseIntPipe) userId: number) {
    return this.levelsService.calculateUserLevel(userId);
  }

  @Get('user/:userId/stats')
  async getUserExperienceStats(@Param('userId', ParseIntPipe) userId: number) {
    return this.levelsService.getUserExperienceStats(userId);
  }

  @Get('user/:userId/history')
  async getUserExperienceHistory(
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.levelsService.getUserExperienceHistory(userId);
  }

  @Post('user/:userId/experience')
  async addExperience(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() addExperienceDto: AddExperienceDto,
  ) {
    const {
      experienceGained,
      experienceType,
      conversationId,
      totalScore,
      difficulty,
      bonusReason,
    } = addExperienceDto;

    return this.levelsService.addExperience(
      userId,
      experienceGained,
      experienceType,
      conversationId,
      difficulty,
      bonusReason,
      totalScore,
    );
  }

  @Post('calculate-conversation-experience')
  calculateConversationExperience(
    @Body() calculateExperienceDto: CalculateExperienceDto,
  ) {
    const { userLevel, conversationLevel } = calculateExperienceDto;
    return this.levelsService.calculateConversationExperience(
      userLevel,
      conversationLevel,
    );
  }
}
