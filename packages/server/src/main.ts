import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as rateLimit from 'express-rate-limit';
import * as helmet from 'helmet';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { TransformInterceptor } from './interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.setGlobalPrefix(app.get('ConfigService').get('SERVER_API_PREFIX', '/api'));
  app.use(
    rateLimit({
      windowMs: 60 * 1000, // 1 minutes
      max: 10000, // limit each IP to 1000 requests per windowMs
    })
  );
  app.use(compression()); // 啟用 gzip 壓縮
  app.use(helmet());
  app.useGlobalInterceptors(new TransformInterceptor()); // 正常情況下，響應值統一
  app.useGlobalFilters(new HttpExceptionFilter()); // 異常情況下，響應值統一
  app.use(bodyParser.json({ limit: '10mb' })); // 修改請求的容量
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Wipi Open Api')
    .setDescription('Wipi Open Api Document')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(app.get('ConfigService').get('SERVER_PORT', 3003));
  console.log('[wipi] 服務啟動成功');
}

bootstrap();
