import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Check,
  JoinColumn,
} from 'typeorm';
import { Conversation } from './conversation.entity';

@Entity('conversation_ratings')
@Check('vocab_beginner_check', 'vocab_beginner BETWEEN 0 AND 100')
@Check('vocab_intermediate_check', 'vocab_intermediate BETWEEN 0 AND 100')
@Check('vocab_advanced_check', 'vocab_advanced BETWEEN 0 AND 100')
@Check('grammar_beginner_check', 'grammar_beginner BETWEEN 0 AND 100')
@Check('grammar_natural_check', 'grammar_natural BETWEEN 0 AND 100')
@Check('grammar_advanced_check', 'grammar_advanced BETWEEN 0 AND 100')
@Check('expression_simple_check', 'expression_simple BETWEEN 0 AND 100')
@Check('expression_varied_check', 'expression_varied BETWEEN 0 AND 100')
@Check('expression_creative_check', 'expression_creative BETWEEN 0 AND 100')
@Check('total_score_check', 'total_score BETWEEN 0 AND 5')
export class ConversationRating {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Conversation, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'conversation_id' })
  conversation: Conversation;

  @Column({ name: 'vocab_beginner', type: 'int' })
  vocabBeginner: number;

  @Column({ name: 'vocab_intermediate', type: 'int' })
  vocabIntermediate: number;

  @Column({ name: 'vocab_advanced', type: 'int' })
  vocabAdvanced: number;

  @Column({ name: 'grammar_beginner', type: 'int' })
  grammarBeginner: number;

  @Column({ name: 'grammar_natural', type: 'int' })
  grammarNatural: number;

  @Column({ name: 'grammar_advanced', type: 'int' })
  grammarAdvanced: number;

  @Column({ name: 'expression_simple', type: 'int' })
  expressionSimple: number;

  @Column({ name: 'expression_varied', type: 'int' })
  expressionVaried: number;

  @Column({ name: 'expression_creative', type: 'int' })
  expressionCreative: number;

  @Column({
    name: 'total_score',
    type: 'numeric', // 숫자 타입 (소수점 포함)
    precision: 2, // 전체 자릿수 (정수부 + 소수부)
    scale: 1, // 소수점 자릿수
    nullable: true, // null 값 허용
  })
  totalScore: number;

  @CreateDateColumn({ name: 'analyzed_at' })
  analyzedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
