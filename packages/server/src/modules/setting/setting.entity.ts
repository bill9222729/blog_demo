import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Setting {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ type: 'text', default: null })
  i18n: string; // 國際化

  @ApiProperty()
  @Column({ type: 'text', default: null })
  systemUrl: string; // 系統地址

  @ApiProperty()
  @Column({ type: 'text', default: null })
  systemTitle: string; // 系統標題

  @ApiProperty()
  @Column({ type: 'text', default: null })
  systemLogo: string; // 系統Logo

  @ApiProperty()
  @Column({ type: 'text', default: null })
  systemBg: string; // 全局背景

  @ApiProperty()
  @Column({ type: 'text', default: null })
  systemFavicon: string; // 系統 favicon

  @ApiProperty()
  @Column({ type: 'text', default: null })
  systemFooterInfo: string; // 系統頁尾

  @ApiProperty()
  @Column({ type: 'text', default: null })
  adminSystemUrl: string; // 後台系統地址

  @ApiProperty()
  @Column({ type: 'text', default: null })
  baiduAnalyticsId: string; // 百度統計id

  @ApiProperty()
  @Column({ type: 'text', default: null })
  googleAnalyticsId: string; // Google分析 id

  @ApiProperty()
  @Column({ type: 'text', default: null })
  seoKeyword: string; // SEO 關鍵字

  @ApiProperty()
  @Column({ type: 'text', default: null })
  seoDesc: string; // SEO 描述

  @ApiProperty()
  @Column({ type: 'text', default: null })
  oss: string; // OSS 上傳配置

  @ApiProperty()
  @Column({ type: 'text', default: null })
  smtpHost: string; // SMTP 地址

  @ApiProperty()
  @Column({ type: 'text', default: null })
  smtpPort: string; // SMTP 埠

  @ApiProperty()
  @Column({ type: 'text', default: null })
  smtpUser: string; // SMTP 用戶

  @ApiProperty()
  @Column({ type: 'text', default: null })
  smtpPass: string; // SMTP 授權碼

  @ApiProperty()
  @Column({ type: 'text', default: null })
  smtpFromUser: string; // SMTP 發件人

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
