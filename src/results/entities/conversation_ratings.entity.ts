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
import { Conversation } from '@src/conversations/entities/conversation.entity';

@Entity('conversation_ratings')
@Check(
  'total_score_percentage_check',
  'total_score_percentage BETWEEN 0 AND 100',
)
export class ConversationRating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'conversation_id' })
  conversationId: number;

  @ManyToOne(() => Conversation)
  @JoinColumn({ name: 'conversation_id' })
  conversation: Conversation;

  // 발화량
  @Column({ name: 'speech_sentence_count', type: 'int' })
  speechSentenceCount: number;

  @Column({ name: 'speech_word_count', type: 'int' })
  speechWordCount: number;

  // 어휘력 (Vocabulary)
  @Column({ name: 'vocab_beginner_count', type: 'int' })
  vocabBeginnerCount: number;

  @Column({
    name: 'vocab_beginner_ratio',
    type: 'decimal',
    precision: 5,
    scale: 2,
  })
  vocabBeginnerRatio: number;

  @Column({ name: 'vocab_intermediate_count', type: 'int' })
  vocabIntermediateCount: number;

  @Column({
    name: 'vocab_intermediate_ratio',
    type: 'decimal',
    precision: 5,
    scale: 2,
  })
  vocabIntermediateRatio: number;

  @Column({ name: 'vocab_advanced_count', type: 'int' })
  vocabAdvancedCount: number;

  @Column({
    name: 'vocab_advanced_ratio',
    type: 'decimal',
    precision: 5,
    scale: 2,
  })
  vocabAdvancedRatio: number;

  // 어휘 다양도 (추가)
  @Column({ name: 'vocab_diversity_count', type: 'int' })
  vocabDiversityCount: number;

  @Column({
    name: 'vocab_diversity_score',
    type: 'decimal',
    precision: 5,
    scale: 2,
  })
  vocabDiversityScore: number;

  // 정확도 (Accuracy) - Count/Ratio 분리
  @Column({ name: 'sentence_accuracy_low_count', type: 'int' })
  sentenceAccuracyLowCount: number;

  @Column({
    name: 'sentence_accuracy_low_ratio',
    type: 'decimal',
    precision: 5,
    scale: 2,
  })
  sentenceAccuracyLowRatio: number;

  @Column({ name: 'sentence_accuracy_medium_count', type: 'int' })
  sentenceAccuracyMediumCount: number;

  @Column({
    name: 'sentence_accuracy_medium_ratio',
    type: 'decimal',
    precision: 5,
    scale: 2,
  })
  sentenceAccuracyMediumRatio: number;

  @Column({ name: 'sentence_accuracy_high_count', type: 'int' })
  sentenceAccuracyHighCount: number;

  @Column({
    name: 'sentence_accuracy_high_ratio',
    type: 'decimal',
    precision: 5,
    scale: 2,
  })
  sentenceAccuracyHighRatio: number;

  @Column({
    name: 'sentence_accuracy_score',
    type: 'decimal',
    precision: 5,
    scale: 2,
  })
  sentenceAccuracyScore: number;

  // 표현력 (Expressiveness)
  @Column({ name: 'express_beginner_count', type: 'int' })
  expressBeginnerCount: number;

  @Column({
    name: 'express_beginner_ratio',
    type: 'decimal',
    precision: 5,
    scale: 2,
  })
  expressBeginnerRatio: number;

  @Column({ name: 'express_intermediate_count', type: 'int' })
  expressIntermediateCount: number;

  @Column({
    name: 'express_intermediate_ratio',
    type: 'decimal',
    precision: 5,
    scale: 2,
  })
  expressIntermediateRatio: number;

  @Column({ name: 'express_advanced_count', type: 'int' })
  expressAdvancedCount: number;

  @Column({
    name: 'express_advanced_ratio',
    type: 'decimal',
    precision: 5,
    scale: 2,
  })
  expressAdvancedRatio: number;

  // 표현력 점수 (추가)
  @Column({
    name: 'express_score',
    type: 'decimal',
    precision: 5,
    scale: 2,
  })
  expressScore: number;

  @Column({
    name: 'express_appropriateness_score',
    type: 'decimal',
    precision: 5,
    scale: 2,
  })
  expressAppropriatenessScore: number;

  @Column({
    name: 'express_creativity_score',
    type: 'decimal',
    precision: 5,
    scale: 2,
  })
  expressCreativityScore: number;

  // 종합 점수
  @Column({
    name: 'total_score_percentage',
    type: 'decimal',
    precision: 5,
    scale: 2,
  })
  totalScorePercentage: number;

  // 종합 점수 별점
  @Column({ name: 'total_score_star', type: 'int' })
  totalScoreStar: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
