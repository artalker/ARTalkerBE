import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('level_requirements')
export class LevelRequirement {
  @PrimaryColumn()
  level: number;

  @Column({ name: 'required_experience' })
  requiredExperience: number;

  @Column({ name: 'level_name', length: 50 })
  levelName: string;

  @Column({ name: 'level_name_ko', length: 50 })
  levelNameKo: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
