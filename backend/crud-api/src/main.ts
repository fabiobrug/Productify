import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend communication
  app.enableCors({
    origin: [
      'http://localhost:4200', // Angular dev server default
      'http://localhost:4201', // Angular dev server alternative
      'http://localhost:4202', // Angular dev server alternative
      'http://localhost:4203', // Angular dev server alternative
      'http://localhost:4204', // Angular dev server alternative
      'http://localhost:4205', // Angular dev server alternative
      'https://*.vercel.app', // Vercel frontend domains
      'https://productify-frontend.vercel.app', // Specific frontend domain
      'https://productify.vercel.app', // Main domain
      'https://productify-xi.vercel.app/'
      
    ],
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

// Para Vercel, exportar a função bootstrap
if (process.env.NODE_ENV === 'production') {
  bootstrap();
} else {
  bootstrap();
}
