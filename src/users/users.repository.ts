import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersRepository {
  private usersRepository: Repository<User>;

  constructor(private readonly dataSource: DataSource) {
    this.usersRepository = this.dataSource.getRepository(User);
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const {
      kakaoId,
      name,
      level,
      experience,
      profileImageUrl,
      thumbnailImageUrl,
    } = createUserDto;
    const user = this.usersRepository.create({
      kakaoId,
      name,
      level,
      experience,
      profileImageUrl,
      thumbnailImageUrl,
    });
    return this.usersRepository.save(user);
  }

  async findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<User | null> {
    await this.usersRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async findByKakaoId(kakaoId: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { kakaoId } });
  }

  async addExperience(userId: number, experienceGained: number): Promise<void> {
    await this.usersRepository
      .createQueryBuilder()
      .update(User)
      .set({
        experience: () => `experience + ${experienceGained}`,
      })
      .where('id = :id', { id: userId })
      .execute();
  }

  async updateUserLevel(userId: number, newLevel: number): Promise<void> {
    await this.usersRepository.update(userId, { level: newLevel });
  }

  async getUserWithExperience(userId: number): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id: userId },
      select: ['id', 'name', 'level', 'experience', 'profileImageUrl'],
    });
  }
}
