import { ApiProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcryptjs';
import { Exclude } from 'class-transformer';
import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {
  /**
   * 檢測密碼是否一致
   * @param password0 加密前密碼
   * @param password1 加密後密碼
   */
  static comparePassword(password0, password1) {
    return bcrypt.compareSync(password0, password1);
  }

  static encryptPassword(password) {
    return bcrypt.hashSync(password, 10);
  }

  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ApiProperty()
  @Column({ length: 500 })
  name: string;

  @ApiProperty()
  @Exclude()
  @Column({ length: 500 })
  password: string;

  @ApiProperty()
  @Column({ length: 500, default: null })
  avatar: string; // 頭像

  @ApiProperty()
  @Column({ length: 500, default: null })
  email: string; // 信箱

  @ApiProperty()
  @Column('simple-enum', { enum: ['admin', 'visitor'], default: 'visitor' })
  role: string; // 用戶角色

  @ApiProperty()
  @Column('simple-enum', { enum: ['locked', 'active'], default: 'active' })
  status: string; // 用戶狀態

  @ApiProperty()
  @Column({ default: 'normal' })
  type: string; // 用戶類型

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

  /**
   * 插入數據前，對密碼進行加密
   */
  @BeforeInsert()
  encrypt() {
    this.password = bcrypt.hashSync(this.password, 10);
  }
}
