import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Conversation } from '@src/conversations/entities/conversation.entity';
import { Messages } from '@src/messages/entities/messages.entity';

@Entity()
@Entity('conversation_feedbacks')
export class ConversationFeedback {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'conversation_id' })
  conversationId: number;

  @ManyToOne(() => Conversation)
  @JoinColumn({ name: 'conversation_id' })
  conversation: Conversation;

  @ManyToOne(() => Messages)
  @JoinColumn({ name: 'message_id' })
  message: Messages;

  @Column({ name: 'original_text', type: 'text' })
  originalText: string;

  @Column({ name: 'revised_text', type: 'text' })
  revisedText: string;

  @Column({
    name: 'explanation',
    type: 'varchar',
    length: 500,
    comment: '한국어 설명 (500자 이내)',
  })
  explanation: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
