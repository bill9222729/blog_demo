import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class File {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  originalname: string; // 檔案名

  @ApiProperty()
  @Column()
  filename: string; // 檔案名

  @ApiProperty()
  @Column()
  type: string; // 文件訊息

  @ApiProperty()
  @Column()
  size: number; // 檔案大小

  @ApiProperty()
  @Column()
  url: string;

  @ApiProperty()
  @CreateDateColumn({
    type: 'datetime',
    comment: '創建時間',
    name: 'create_at',
  })
  createAt: Date;
}
