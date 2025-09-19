import { IsEnum, IsString } from 'class-validator';

export enum NotificationTypeEnum {
  MESSAGE = 'message',
  FRIEND_REQUEST = 'friend_request',
  SYSTEM = 'system',
  OTHER = 'other',
}

export class createNotificationDto {
  @IsString() profileId: string;
  @IsString() body: string;
  @IsEnum(NotificationTypeEnum) type: NotificationTypeEnum;
}
