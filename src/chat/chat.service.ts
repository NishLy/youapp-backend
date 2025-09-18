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
    profileId: string,
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
    return this.conversationModel.create({ participants: [profileId] });
  }

  async addToParticipant(
    conversation: ConversationDocument,
    profileId: string,
  ) {
    conversation.participants = Array.from(
      new Set([...conversation.participants, profileId]),
    );

    return conversation.save();
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

  // view messages
  async viewMessages(
    profileId: string,
    conversationId?: string,
    page: number = 1,
    limit: number = 15,
  ) {
    let conversationIds: string[] = [];

    if (conversationId) {
      conversationIds = [conversationId];
    } else {
      const conversations = await this.conversationModel
        .find({ participants: profileId })
        .select('_id')
        .exec();

      conversationIds = conversations.map((c) =>
        (c._id as Types.ObjectId).toString(),
      );
    }

    if (conversationIds.length === 0) {
      return []; // no conversations, return empty
    }

    // Find all messages for those conversations
    const messages = await this.messageModel
      .find({ conversationId: { $in: conversationIds } })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return messages;
  }

  async function notifyParticipants(conversation:ConversationDocument){
      // this.client.emit('chat.notification', );
  }
}
