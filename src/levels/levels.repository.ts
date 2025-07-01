import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LevelRequirement } from './entities/level-requirement.entity';
import { ExperienceLog } from './entities/experience-log.entity';

@Injectable()
export class LevelsRepository {
  constructor(
    @InjectRepository(LevelRequirement)
    private levelRequirementRepository: Repository<LevelRequirement>,
    @InjectRepository(ExperienceLog)
    private experienceLogRepository: Repository<ExperienceLog>,
  ) {}

  async findAllLevels(): Promise<LevelRequirement[]> {
    return this.levelRequirementRepository.find({
      where: { isActive: true },
      order: { level: 'ASC' },
    });
  }

  async findLevelByExperience(
    experience: number,
  ): Promise<LevelRequirement | null> {
    return this.levelRequirementRepository
      .createQueryBuilder('level')
      .where('level.required_experience <= :experience', { experience })
      .andWhere('level.is_active = true')
      .orderBy('level.level', 'DESC')
      .getOne();
  }

  async findNextLevel(currentLevel: number): Promise<LevelRequirement | null> {
    return this.levelRequirementRepository.findOne({
      where: {
        level: currentLevel + 1,
        isActive: true,
      },
    });
  }

  async createExperienceLog(
    logData: Partial<ExperienceLog>,
  ): Promise<ExperienceLog> {
    const log = this.experienceLogRepository.create(logData);
    return this.experienceLogRepository.save(log);
  }

  async getUserExperienceHistory(userId: number): Promise<ExperienceLog[]> {
    return this.experienceLogRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      relations: ['conversation'],
    });
  }

  async getTotalExperienceGained(userId: number): Promise<number> {
    const result = (await this.experienceLogRepository
      .createQueryBuilder('log')
      .select('SUM(log.experience_gained)', 'total')
      .where('log.user_id = :userId', { userId })
      .getRawOne()) as { total: string } | null;

    return parseInt(result?.total || '0') || 0;
  }

  async getRecentExperienceGains(
    userId: number,
    days: number = 7,
  ): Promise<ExperienceLog[]> {
    return this.experienceLogRepository
      .createQueryBuilder('log')
      .where('log.user_id = :userId', { userId })
      .andWhere('log.created_at >= :startDate', {
        startDate: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
      })
      .orderBy('log.created_at', 'DESC')
      .getMany();
  }

  async getExperienceStatsByType(userId: number): Promise<
    {
      type: string;
      count: string;
      totalExperience: string;
      avgExperience: string;
    }[]
  > {
    return this.experienceLogRepository
      .createQueryBuilder('log')
      .select('log.experience_type', 'type')
      .addSelect('COUNT(*)', 'count')
      .addSelect('SUM(log.experience_gained)', 'totalExperience')
      .addSelect('AVG(log.experience_gained)', 'avgExperience')
      .where('log.user_id = :userId', { userId })
      .groupBy('log.experience_type')
      .getRawMany();
  }
}
