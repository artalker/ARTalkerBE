import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '@src/users/entities/user.entity';
import { Conversation } from '@src/conversations/entities/conversation.entity';

@Entity('experience_logs')
export class ExperienceLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'conversation_id', nullable: true })
  conversationId: number;

  @ManyToOne(() => Conversation, { nullable: true })
  @JoinColumn({ name: 'conversation_id' })
  conversation: Conversation;

  @Column({ name: 'experience_gained' })
  experienceGained: number;

  @Column({ name: 'experience_type', length: 50 })
  experienceType: string;

  @Column({
    name: 'total_score_percentage',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  totalScorePercentage: number;

  @Column({ nullable: true })
  difficulty: number;

  @Column({ name: 'bonus_reason', type: 'text', nullable: true })
  bonusReason: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
