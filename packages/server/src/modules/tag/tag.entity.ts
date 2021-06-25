import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Article } from '../article/article.entity';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  label: string;

  @ApiProperty()
  @Column()
  value: string;

  @ApiProperty()
  @ManyToMany(
    () => Article,
    (article) => article.tags
  )
  articles: Array<Article>;

  @ApiProperty()
  @CreateDateColumn({
    type: 'datetime',
    comment: '創建時間',
    name: 'create_at',
  })
  createAt: Date;

  @ApiProperty()
  @UpdateDateColumn({
    type: 'datetime',
    comment: '更新時間',
    name: 'update_at',
  })
  updateAt: Date;
}
