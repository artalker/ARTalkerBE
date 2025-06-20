import { Module } from '@nestjs/common';
import { TipsService } from './tips.service';
import { TipsController } from './tips.controller';
import { TipsRepository } from './tips.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tip } from './entities/tip.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tip])],
  controllers: [TipsController],
  providers: [TipsService, TipsRepository],
})
export class TipsModule {}
