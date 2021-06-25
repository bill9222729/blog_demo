import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Comment {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  email: string; // 聯絡方式

  @ApiProperty()
  @Column()
  avatar: string;

  @ApiProperty()
  @Column({ type: 'mediumtext', default: null, charset: 'utf8mb4' }) // 評論內容
  content: string;

  @ApiProperty()
  @Column({ type: 'mediumtext', default: null, charset: 'utf8mb4' }) // 評論內容
  html: string;

  @ApiProperty()
  @Column({ type: 'boolean', default: false })
  pass: boolean; // 是否審核通過

  @ApiProperty()
  @Column({ type: 'mediumtext', default: null, charset: 'utf8mb4' })
  userAgent: string;

  @ApiProperty()
  @Column()
  hostId: string; // 關聯文章或頁面 id

  @ApiProperty()
  @Column()
  url: string; // 關聯頁面路徑，可與 systemUrl 拼接

  @ApiProperty()
  @Column({ default: null })
  parentCommentId: string; // 父級評論 id

  @ApiProperty()
  @Column({ default: null })
  replyUserName: string; // 回復評論使用者名稱

  @ApiProperty()
  @Column({ default: null })
  replyUserEmail: string; // 回復評論信箱

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
