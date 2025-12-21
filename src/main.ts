import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'; 

const cookieParser = require('cookie-parser');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('MovieRate API')
    .setDescription('API для рецензій та рейтингів фільмів')
    .setVersion('1.0')
    .addTag('Auth', 'Автентифікація користувачів')
    .addTag('Users', 'Управління користувачами')
    .addTag('Movies', 'Управління фільмами')
    .addTag('Reviews', 'Рецензії фільмів')
    .addTag('Ratings', 'Рейтинги фільмів')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Введіть JWT токен',
        in: 'header',
      },
      'JWT-auth', 
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'MovieRate API Docs',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`\n🚀 API Started! Port: http://localhost:${port}`);
  console.log(`📚 Swagger Docs: http://localhost:${port}/api/docs\n`);
}
bootstrap();