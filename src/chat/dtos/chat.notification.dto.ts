import { IsOptional, IsString } from 'class-validator';

export class SendMessageDto {
  @IsOptional() conversationId?: string;
  @IsOptional() to?: string;
  @IsString() text: string;
  @IsOptional() attachments?: { url: string; mimeType?: string }[];
}
