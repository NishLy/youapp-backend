import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dtos/chat.send-message.dto';

@Controller()
export class ChatConsumer {
  constructor(private chatService: ChatService) {}

  @EventPattern('chat.message')
  async handleChatMessage(@Payload() data: SendMessageDto & { from: string }) {
    const conversation = await this.chatService.findOrCreateConversation(
      data.from,
      data.conversationId,
    );

    if (data.to) await this.chatService.addToParticipant(conversation, data.to);

    await this.chatService.createMessage(
      String(conversation._id),
      data,
      data.from,
    );
  }
}
