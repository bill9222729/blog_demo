import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class View {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  ip: string;

  @ApiProperty()
  @Column({ type: 'text', default: null })
  userAgent: string;

  @ApiProperty()
  @Column({ type: 'text', default: null })
  url: string;

  @ApiProperty()
  @Column({ default: 1 })
  count: number; // 同一 userAgent ，同一 url 的訪問量

  @ApiProperty()
  @Column({ type: 'text', default: null })
  address: string; // 訪問地址

  @ApiProperty()
  @Column({ type: 'text', default: null })
  browser: string; // 訪問瀏覽器

  @ApiProperty()
  @Column({ type: 'text', default: null })
  engine: string; // 訪問的瀏覽器內核

  @ApiProperty()
  @Column({ type: 'text', default: null })
  os: string; // 訪問操作系統

  @ApiProperty()
  @Column({ type: 'text', default: null })
  device: string; // 訪問設備

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
