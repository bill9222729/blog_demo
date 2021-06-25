import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
// 配置文件
import { file as envFilePath } from '@wipi/config';

import { Article } from './modules/article/article.entity';
// 文章模組
import { ArticleModule } from './modules/article/article.module';
// 鑒權模組
import { AuthModule } from './modules/auth/auth.module';
import { Category } from './modules/category/category.entity';
// 分類模組
import { CategoryModule } from './modules/category/category.module';
import { Comment } from './modules/comment/comment.entity';
// 評論模組
import { CommentModule } from './modules/comment/comment.module';
import { File } from './modules/file/file.entity';
// 文件模組
import { FileModule } from './modules/file/file.module';
import { Knowledge } from './modules/knowledge/knowledge.entity';
// 知識庫模組
import { KnowledgeModule } from './modules/knowledge/knowledge.module';
import { Page } from './modules/page/page.entity';
// 頁面模組
import { PageModule } from './modules/page/page.module';
// 搜索模組
import { Search } from './modules/search/search.entity';
import { SearchModule } from './modules/search/search.module';
import { Setting } from './modules/setting/setting.entity';
// 系統模組
import { SettingModule } from './modules/setting/setting.module';
import { SMTP } from './modules/smtp/smtp.entity';
// 郵件模組
import { SMTPModule } from './modules/smtp/smtp.module';
import { Tag } from './modules/tag/tag.entity';
// 標籤模組
import { TagModule } from './modules/tag/tag.module';
import { User } from './modules/user/user.entity';
// 用戶模組
import { UserModule } from './modules/user/user.module';
import { View } from './modules/view/view.entity';
// 訪問統計模組
import { ViewModule } from './modules/view/view.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: [envFilePath] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        entities: [User, File, Knowledge, Article, Category, Tag, Comment, Setting, SMTP, Page, View, Search],
        host: configService.get('DB_HOST', '0.0.0.0'),
        port: configService.get<number>('DB_PORT', 3306),
        username: configService.get('DB_USER', 'root'),
        password: configService.get('DB_PASSWD', 'root'),
        database: configService.get('DB_DATABASE', 'wipi'),
        charset: 'utf8mb4',
        timezone: '+08:00',
        synchronize: true,
      }),
    }),
    UserModule,
    FileModule,
    TagModule,
    ArticleModule,
    KnowledgeModule,
    CategoryModule,
    CommentModule,
    SettingModule,
    SMTPModule,
    AuthModule,
    PageModule,
    ViewModule,
    SearchModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
