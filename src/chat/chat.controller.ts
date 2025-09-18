import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Query,
  Get,
} from '@nestjs/common';
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

  @UseGuards(AuthGuard('jwt'))
  @Get('viewMessages')
  viewMessages(
    @Req() req: Request & { user: AuthJWTPayload },
    @Query('conversationId') conversationId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 20;

    return this.chatService.viewMessages(
      req.user.id,
      conversationId,
      pageNumber,
      limitNumber,
    );
  }
}
