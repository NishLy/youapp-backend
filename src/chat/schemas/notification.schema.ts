import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ required: true })
  userId: string;
  @Prop({ required: true })
  type: 'message' | 'friend_request' | 'system' | 'other';
  @Prop({ type: String })
  title?: string;
  @Prop({ type: String })
  body?: string;
  @Prop({ type: Object, default: {} })
  metadata: Record<string, any>;
  @Prop({
    required: true,
    enum: ['unread', 'read'],
    default: 'unread',
  })
  status: 'unread' | 'read';
  @Prop({ type: Date, default: Date.now })
  deliveredAt: Date;
  @Prop({ type: Date })
  readAt?: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
