import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { SendMessageDto } from './dtos/chat.send-message.dto';
import { ChatService } from './chat.service';
import { AuthJWTPayload } from 'src/auth/types/auth';
import { AuthGuard } from '@nestjs/passport';

@Controller('api')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('sendMessage')
  sendMessage(
    @Body() payload: SendMessageDto,
    @Req() req: Request & { user: AuthJWTPayload },
  ) {
    this.chatService.produceMessageQueue(payload, req.user.id);
    return { message: 'Succefully send message' };
  }
}
