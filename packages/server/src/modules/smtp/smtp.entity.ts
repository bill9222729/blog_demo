import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SMTP {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ type: 'text', default: null })
  from: string; // 發件人

  @ApiProperty()
  @Column({ type: 'text', default: null })
  to: string; // 收件人

  @ApiProperty()
  @Column({ type: 'text', default: null })
  subject: string; // 主題

  @ApiProperty()
  @Column({ type: 'text', default: null })
  text: string; // 文本內容

  @ApiProperty()
  @Column({ type: 'text', default: null })
  html: string; // html 內容

  @ApiProperty()
  @CreateDateColumn({
    type: 'datetime',
    comment: '創建時間',
    name: 'create_at',
  })
  createAt: Date;
}
