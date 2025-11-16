import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { GlobalHttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    exposedHeaders: 'Authorization',
  });
  
  // Set global prefix
  app.setGlobalPrefix('api');

  // Enable global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip unknown properties
      forbidNonWhitelisted: true, // throw 400 on unknown props
      transform: true, // auto-transform payloads to DTO instances (enables @Type() usage)
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalFilters(new GlobalHttpExceptionFilter());

  await app.listen(process.env.PORT || 3001);
  console.log(`Backend running on http://localhost:${process.env.PORT || 3001}/api`);
}
bootstrap();
