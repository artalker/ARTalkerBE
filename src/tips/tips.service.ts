import { Injectable } from '@nestjs/common';
import { CreateTipDto } from './dto/create-tip.dto';
import { UpdateTipDto } from './dto/update-tip.dto';
import { TipsRepository } from './tips.repository';
import { SearchTipDto } from './dto/search-tip.dto';

@Injectable()
export class TipsService {
  constructor(private readonly tipsRepository: TipsRepository) {}

  create(createTipDto: CreateTipDto) {
    return this.tipsRepository.createTip(createTipDto);
  }

  async getTodayTips() {
    return await this.tipsRepository.getTodayTips();
  }

  async searchTips(searchDto: SearchTipDto) {
    return await this.tipsRepository.searchTips(searchDto);
  }

  findAll() {
    return `This action returns all tips`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tip`;
  }

  update(id: number, updateTipDto: UpdateTipDto) {
    return `This action updates a #${id} tip`;
  }

  remove(id: number) {
    return `This action removes a #${id} tip`;
  }
}
