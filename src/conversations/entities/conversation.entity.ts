import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Check,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { User } from '@src/users/entities/user.entity';
import { Artwork } from '@src/artworks/entities/artwork.entity';
import { ConversationRating } from '@src/results/entities/conversation_ratings.entity';
import { ConversationFeedback } from '@src/results/entities/conversation_feedbacks.entity';

@Entity()
@Check('user_level_check', 'user_level BETWEEN 1 AND 7')
@Check('difficulty_check', 'difficulty BETWEEN 1 AND 5')
export class Conversation {
  @PrimaryGeneratedColumn()
  id: number;

  // 다대일 관계 (N:1)
  // 각 대화는 하나의 사용자와 작품에만 연결
  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Artwork, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'artwork_id' })
  artwork: Artwork;

  @OneToOne(() => ConversationRating, (rating) => rating.conversation)
  rating: ConversationRating;

  @OneToOne(() => ConversationFeedback, (feedback) => feedback.conversation)
  feedback: ConversationFeedback;

  @Column({ name: 'user_level', type: 'numeric' })
  userLevel: number; // 학습하는 현재 유저 레벨

  @Column({ type: 'numeric' })
  difficulty: number;

  @Column({ name: 'is_complete', type: 'boolean' })
  isComplete: boolean;

  @Column({ name: 'is_deleted', type: 'boolean', default: false })
  isDeleted: boolean;

  @Column({ name: 'deleted_at', nullable: true })
  deletedAt: Date;

  // @CreateDateColumn  레코드가 생성성될 때 현재 시간을 자동으로 할당
  @Column({ name: 'started_at' })
  startedAt: Date;

  @Column({ name: 'ended_at', nullable: true })
  endedAt: Date;

  @Column({ name: 'updated_at', nullable: true })
  updatedAt: Date;
}
