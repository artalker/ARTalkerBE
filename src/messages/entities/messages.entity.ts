import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Conversation } from '@src/conversations/entities/conversation.entity';

@Entity()
export class Messages {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Conversation, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'conversation_id' })
  conversation: Conversation;

  @Column({ name: 'response_id', type: 'varchar', length: 100, nullable: true })
  responseId: string;

  @Column({ type: 'varchar', length: 10 })
  sender: 'user' | 'assistant';

  @Column('text')
  content: string;

  @Column({ name: 'ko_content', type: 'text', nullable: true })
  ko_content: string;

  @CreateDateColumn({ name: 'timestamp' })
  timestamp: Date;
}
