import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ConversationDocument = Conversation & Document;

@Schema({ timestamps: true })
export class Conversation {
  @Prop({ required: true })
  type: 'pair' | 'group';
  @Prop({ default: [] })
  participants: [string];
  @Prop({ required: true, default: { title: 'untitled' } })
  metadata: { title?: string };
  @Prop({ required: true, default: new Date() })
  lastMessageAt: Date;
}

// Generate schema
export const ConversationSchema = SchemaFactory.createForClass(Conversation);
