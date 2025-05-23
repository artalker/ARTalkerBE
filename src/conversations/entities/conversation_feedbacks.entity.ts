import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Check,
  JoinColumn,
} from 'typeorm';
import { Conversation } from './conversation.entity';
import { Messages } from '../../messages/entities/messages.entity';

@Entity()
@Check(
  'feedback_type_check',
  "feedback_type IN ('grammar', 'vocabulary', 'expression')",
)
export class ConversationFeedback {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Conversation, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'conversation_id' })
  conversation: Conversation;

  @ManyToOne(() => Messages, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'message_id' })
  message: Messages;

  @Column({ name: 'original_text', type: 'text' })
  originalText: string;

  @Column({ name: 'revised_text', type: 'text' })
  revisedText: string;

  @Column({ type: 'text' })
  explanation: string;

  @Column({
    name: 'feedback_type',
    type: 'varchar',
    length: 20,
    default: 'grammar',
  })
  feedbackType: 'grammar' | 'vocabulary' | 'expression';

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
