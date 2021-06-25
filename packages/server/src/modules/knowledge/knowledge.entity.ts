import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Knowledge {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ default: null })
  parentId: string; // 父級 id，如果該項為空，則是書的封面，不為空則是一個章節

  @ApiProperty()
  @Column({ type: 'int', default: 0 })
  order: number; // 章節排序

  @ApiProperty()
  @Column()
  title: string; // 標題

  @ApiProperty()
  @Column({ default: null })
  cover: string; // 封面圖

  @ApiProperty()
  @Column({ type: 'text', default: null })
  summary: string; // 摘要，自動生成

  @ApiProperty()
  @Column({ type: 'mediumtext', default: null, charset: 'utf8mb4' })
  content: string; // 原始內容

  @ApiProperty()
  @Column({ type: 'mediumtext', default: null, charset: 'utf8mb4' })
  html: string; // 格式化內容，自動生成

  @ApiProperty()
  @Column({ type: 'mediumtext', default: null })
  toc: string; // 格式化內容索引，自動生成

  @ApiProperty()
  @Column('simple-enum', { enum: ['draft', 'publish'], default: 'draft' })
  status: string; // 文章狀態

  @ApiProperty()
  @Column({ type: 'int', default: 0 })
  views: number; // 閱讀量

  @ApiProperty()
  @Column({ type: 'int', default: 0 })
  likes: number; // 喜歡數

  @ApiProperty()
  @Column({ type: 'boolean', default: true })
  isCommentable: boolean;

  @ApiProperty()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  publishAt: Date; // 發布日期

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
