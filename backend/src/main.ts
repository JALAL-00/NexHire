import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // --- This is the key section for serving uploaded images ---
  // It maps the URL prefix '/uploads' to the physical './uploads' directory.
  // Using process.cwd() is more robust than __dirname for finding the project root.
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  // Your CORS setup is correct for local development.
  app.enableCors({
    origin: 'http://localhost:3001', // Your frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`); // Helpful log
}
bootstrap();