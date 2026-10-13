import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module.js';
import { configureHttp } from './shared/presentation/http/configure-http.js';
import { snakeCaseDocument } from './shared/presentation/swagger/snake-case-document.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));
  const config = app.get(ConfigService);

  app.enableCors({
    origin: (config.get<string>('CORS_ORIGIN') ?? 'http://localhost:5173').split(','),
  });
  configureHttp(app);

  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('Mall Assistant API')
      .setVersion('1.0')
      .addBearerAuth()
      .build(),
  );
  SwaggerModule.setup('docs', app, snakeCaseDocument(document));

  await app.listen(Number(config.get('PORT') ?? 3000));
}
await bootstrap();
