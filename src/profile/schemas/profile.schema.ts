import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProfileDocument = Profile & Document;

@Schema({ timestamps: true }) // auto adds createdAt & updatedAt
export class Profile {
  @Prop({ required: true, unique: true })
  userName: string;
  @Prop({ required: true, unique: true })
  email: string;
  @Prop({ required: true, select: false })
  password: string;
  @Prop()
  displayName: string;
  @Prop({ enum: ['male', 'female'] })
  gender: string;
  @Prop()
  birthDate: Date;
  @Prop()
  zodiacSign: string;
  @Prop()
  horoscopeSign: string;
  @Prop()
  photoUrl: string;
  @Prop({ default: [] })
  interests: [string];
  @Prop()
  height: number;
  @Prop()
  weight: number;
}

// Generate schema
export const ProfileSchema = SchemaFactory.createForClass(Profile);
