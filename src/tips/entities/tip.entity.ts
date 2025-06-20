import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Tip {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  content: string;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'updated_at' })
  updatedAt: Date;
}
