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
  // Use environment variable for CORS or default to localhost
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';

  app.enableCors({
    origin: frontendUrl,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Use the PORT environment variable provided by Railway, or default to 3000
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0'); // Listen on 0.0.0.0 to accept external connections
  console.log(`Application is running on: ${await app.getUrl()}`); // Helpful log
}
bootstrap();