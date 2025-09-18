import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ConversationDocument = Conversation & Document;

@Schema({ timestamps: true })
export class Conversation {
  @Prop({ required: true, default: 'pair' })
  type: 'pair' | 'group';
  @Prop({ default: [] })
  participants: [string];
  @Prop({ type: Object, default: {} })
  metadata: Record<string, any>;
  @Prop({ required: true, default: new Date() })
  lastMessageAt: Date;
}

// Generate schema
export const ConversationSchema = SchemaFactory.createForClass(Conversation);
