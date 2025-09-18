import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // HTTP app
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Attach RabbitMQ microservice
  app.connectMicroservice<MicroserviceOptions>({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://testuser:testpass@localhost:5672'],
      queue: 'my_queue',
      queueOptions: { durable: false },
    },
  });

  // Start both HTTP + RabbitMQ
  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
