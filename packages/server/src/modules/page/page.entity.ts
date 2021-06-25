import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Page {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ default: null })
  cover: string; // 頁面封面

  @ApiProperty()
  @Column()
  name: string; // 頁面名

  @ApiProperty()
  @Column()
  path: string; // 頁面路徑

  @ApiProperty()
  @Column({ type: 'int', default: 0 })
  order: number; // 順序

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
  @Column('simple-enum', { enum: ['draft', 'publish'] })
  status: string; // 頁面狀態

  @ApiProperty()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  publishAt: Date; // 發布日期

  @ApiProperty()
  @Column({ type: 'int', default: 0 })
  views: number; // 閱讀量

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
