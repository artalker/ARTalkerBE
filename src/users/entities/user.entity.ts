import { Entity, Column, PrimaryGeneratedColumn, Check } from 'typeorm';

@Entity('users')
@Check('level_check', 'level BETWEEN 1 AND 7')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  name: string;

  @Column({ name: 'profile_image', type: 'text', nullable: true })
  profileImageUrl: string;

  @Column({ name: 'thumbnail_image', type: 'text', nullable: true })
  thumbnailImageUrl: string;

  @Column({ type: 'integer', default: 1 })
  level: number;

  @Column({ type: 'integer', default: 0 })
  experience: number;

  @Column({ name: 'kakao_id', type: 'text', unique: true, nullable: true })
  kakaoId: string;
}
