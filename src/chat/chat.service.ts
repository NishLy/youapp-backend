import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Conversation,
  ConversationDocument,
} from './schemas/conversation.shema';
import { Message, MessageDocument } from './schemas/message.schema';
import {
  NotificationDocument,
  Notification,
} from './schemas/notification.schema';
import { SendMessageDto } from './dtos/chat.send-message.dto';
import { ClientProxy } from '@nestjs/microservices';
import { Types } from 'mongoose';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<ConversationDocument>,
    @InjectModel(Message.name)
    private messageModel: Model<MessageDocument>,
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
    @Inject('RABBIT_SERVICE') private readonly client: ClientProxy,
  ) {}

  async findOrCreateConversation(
    conversationId?: string,
  ): Promise<ConversationDocument> {
    if (conversationId && Types.ObjectId.isValid(conversationId)) {
      const conversation = await this.conversationModel
        .findById(conversationId)
        .exec();
      if (conversation) {
        return conversation;
      }
    }

    // create a new empty conversation
    return this.conversationModel.create({});
  }

  async createMessage(
    conversationId: string,
    data: SendMessageDto,
    from: string,
  ) {
    return await this.messageModel.create({ ...data, conversationId, from });
  }

  produceMessageQueue(data: SendMessageDto, from: string) {
    this.client.emit('chat.message', { ...data, from });
  }
}
