import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Conversation, ConversationSchema } from './schemas/conversation.shema';
import { Message, MessageSchema } from './schemas/message.schema';
import {
  NotificationSchema,
  Notification,
} from './schemas/notification.schema';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ClientsModule } from '@nestjs/microservices/module/clients.module';
import { Transport } from '@nestjs/microservices';
import { ChatConsumer } from './chat.consumer';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
      {
        name: Message.name,
        schema: MessageSchema,
      },
      {
        name: Notification.name,
        schema: NotificationSchema,
      },
    ]),
    ClientsModule.register([
      {
        name: 'RABBIT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://testuser:testpass@localhost:5672'],
          queue: 'my_queue',
          queueOptions: { durable: false },
        },
      },
    ]),
  ],
  controllers: [ChatController, ChatConsumer],
  providers: [ChatService],
})
export class ChatModule {}
