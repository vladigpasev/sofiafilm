import { json } from 'body-parser';
import * as bodyParser from 'body-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',  // Allow requests from all origins, you can limit this to specific origins
    methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',  // Allow these methods
    allowedHeaders: 'Content-Type, Authorization',  // Allow specific headers
  });

  // Swagger configuration (as per your example)
  const config = new DocumentBuilder()
    .setTitle('Event System API')
    .setDescription('API за управление на събития, билети и плащания')
    .setVersion('1.0')
    .addBearerAuth() 
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Set a raw body for Stripe webhook endpoint
  app.use('/stripe/webhook', bodyParser.raw({ type: 'application/json' }));
  
  // Keep the default body parsing for other routes
  app.use(json({ limit: '10mb' }));

  await app.listen(3000);
}
bootstrap();
