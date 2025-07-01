import { Injectable } from '@nestjs/common';
import { LevelsRepository } from './levels.repository';
import { UsersRepository } from '@src/users/users.repository';

export interface LevelProgress {
  currentLevel: number;
  currentLevelName: string;
  currentLevelNameKo: string;
  currentExperience: number;
  experienceToNext: number;
  progressPercentage: number;
  isMaxLevel: boolean;
}

export interface ExperienceBreakdown {
  experience: number;
  breakdown: string[];
}

@Injectable()
export class LevelsService {
  constructor(
    private readonly levelsRepository: LevelsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async calculateUserLevel(userId: number): Promise<LevelProgress> {
    const user = await this.usersRepository.findOne(userId);
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    const currentLevelData = await this.levelsRepository.findLevelByExperience(
      user.experience,
    );

    if (!currentLevelData) {
      throw new Error('레벨 데이터를 찾을 수 없습니다.');
    }

    const nextLevelData = await this.levelsRepository.findNextLevel(
      currentLevelData.level,
    );

    // 최고 레벨인 경우
    if (!nextLevelData) {
      return {
        currentLevel: currentLevelData.level,
        currentLevelName: currentLevelData.levelName,
        currentLevelNameKo: currentLevelData.levelNameKo,
        currentExperience: user.experience,
        experienceToNext: 0,
        progressPercentage: 100,
        isMaxLevel: true,
      };
    }

    // 다음 레벨까지 남은 경험치
    const experienceToNext = nextLevelData.requiredExperience - user.experience;

    // 현재 레벨 구간에서의 진행도
    const currentLevelProgress =
      user.experience - currentLevelData.requiredExperience;
    const currentLevelTotal =
      nextLevelData.requiredExperience - currentLevelData.requiredExperience;
    const progressPercentage = Math.floor(
      (currentLevelProgress / currentLevelTotal) * 100,
    );

    return {
      currentLevel: currentLevelData.level,
      currentLevelName: currentLevelData.levelName,
      currentLevelNameKo: currentLevelData.levelNameKo,
      currentExperience: user.experience,
      experienceToNext,
      progressPercentage,
      isMaxLevel: false,
    };
  }

  async addExperience(
    userId: number,
    experienceGained: number,
    experienceType: string,
    conversationId?: number,
    difficulty?: number,
    bonusReason?: string,
    totalScore?: number,
  ): Promise<{
    levelUp: boolean;
    oldLevel: number;
    newLevel: number;
    experienceGained: number;
  }> {
    // 현재 레벨 확인
    const oldLevelProgress = await this.calculateUserLevel(userId);

    // 경험치 추가
    await this.usersRepository.addExperience(userId, experienceGained);

    // 경험치 로그 저장
    await this.levelsRepository.createExperienceLog({
      userId,
      conversationId,
      experienceGained,
      experienceType,
      totalScorePercentage: totalScore, // 수동 지급 시 점수 기록 가능
      difficulty,
      bonusReason,
    });

    // 새로운 레벨 확인
    const newLevelProgress = await this.calculateUserLevel(userId);

    // 레벨업 여부 확인
    const levelUp =
      newLevelProgress.currentLevel > oldLevelProgress.currentLevel;

    // User 엔티티의 level 필드도 업데이트
    if (levelUp) {
      await this.usersRepository.updateUserLevel(
        userId,
        newLevelProgress.currentLevel,
      );
    }

    return {
      levelUp,
      oldLevel: oldLevelProgress.currentLevel,
      newLevel: newLevelProgress.currentLevel,
      experienceGained,
    };
  }

  calculateConversationExperience(
    userLevel: number,
    conversationLevel: number,
  ): ExperienceBreakdown {
    const baseExperience = 10;
    let finalExperience = baseExperience;
    const breakdown: string[] = [`기본 경험치: ${baseExperience}`];

    // 레벨 차이에 따른 가중치 계산
    const levelDifference = conversationLevel - userLevel;
    let multiplier = 1.0;

    if (levelDifference > 0) {
      // 대화 레벨이 유저 레벨보다 높음 (도전적) → 높은 경험치
      multiplier = 1 + levelDifference * 0.5; // 레벨 차이당 50% 보너스
      breakdown.push(
        `도전적인 대화 (레벨 차이 +${levelDifference}): x${multiplier.toFixed(1)}`,
      );
    } else if (levelDifference < 0) {
      // 대화 레벨이 유저 레벨보다 낮음 (쉬움) → 낮은 경험치
      const penalty = Math.abs(levelDifference) * 0.2; // 레벨 차이당 20% 감소
      multiplier = Math.max(0.1, 1 - penalty); // 최소 10%는 보장
      breakdown.push(
        `쉬운 대화 (레벨 차이 ${levelDifference}): x${multiplier.toFixed(1)}`,
      );
    } else {
      // 레벨이 같음 → 기본 경험치
      breakdown.push(`적정 난이도 대화: x1.0`);
    }

    finalExperience = Math.floor(baseExperience * multiplier);

    return {
      experience: finalExperience,
      breakdown,
    };
  }

  async getUserExperienceHistory(userId: number) {
    return this.levelsRepository.getUserExperienceHistory(userId);
  }

  async getAllLevels() {
    return this.levelsRepository.findAllLevels();
  }

  async getUserExperienceStats(userId: number) {
    const [history, statsByType, recentGains] = await Promise.all([
      this.levelsRepository.getUserExperienceHistory(userId),
      this.levelsRepository.getExperienceStatsByType(userId),
      this.levelsRepository.getRecentExperienceGains(userId, 7),
    ]);

    const totalExperience =
      await this.levelsRepository.getTotalExperienceGained(userId);
    const levelProgress = await this.calculateUserLevel(userId);

    return {
      levelProgress,
      totalExperience,
      recentGains,
      statsByType,
      historyCount: history.length,
    };
  }
}
