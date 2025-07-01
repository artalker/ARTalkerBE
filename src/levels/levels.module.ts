import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LevelsService } from './levels.service';
import { LevelsRepository } from './levels.repository';
import { LevelsController } from './levels.controller';
import { LevelRequirement } from './entities/level-requirement.entity';
import { ExperienceLog } from './entities/experience-log.entity';
import { UsersModule } from '@src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LevelRequirement, ExperienceLog]),
    UsersModule,
  ],
  controllers: [LevelsController],
  providers: [LevelsService, LevelsRepository],
  exports: [LevelsService],
})
export class LevelsModule {}
