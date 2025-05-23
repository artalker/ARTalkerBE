import { Column, Entity, PrimaryGeneratedColumn, Check } from 'typeorm';

@Entity()
@Check(
  'category_check',
  "\"category\" IN ('동양화', '르네상스', '현대미술', '인상파')",
)
export class Artwork {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text' })
  title_en: string;

  @Column({ type: 'text' })
  title_ko: string;

  @Column({ type: 'text' })
  artist: string;

  @Column({ type: 'text' })
  description_en: string;

  @Column({ type: 'text' })
  description_ko: string;

  @Column({ name: 'image_url', type: 'text' })
  imageUrl: string;

  @Column({ type: 'text' })
  category: string;

  @Column({ type: 'text' })
  year: string;
}
