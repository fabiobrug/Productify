import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend communication
  const corsOrigins = process.env.CORS_ORIGINS 
    ? process.env.CORS_ORIGINS.split(',')
    : [
        'http://localhost:4200', // Angular dev server default
        'http://localhost:4201', // Angular dev server alternative
        'http://localhost:4202', // Angular dev server alternative
        'http://localhost:4203', // Angular dev server alternative
        'http://localhost:4204', // Angular dev server alternative
        'http://localhost:4205', // Angular dev server alternative
      ];

  app.enableCors({
    origin: corsOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  });
  
  // Set global prefix for API routes
  app.setGlobalPrefix('api');
  
  // Enable validation pipes
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Server is running on port ${port}`);
}

bootstrap();
