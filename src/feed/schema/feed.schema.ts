import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FeedDocument = Feed & Document;

@Schema({ timestamps: true })
export class Feed {
  @Prop({ required: true })
  title: string;

  @Prop()
  body: string;

  @Prop()
  image: string;

  @Prop()
  source: string;

  @Prop()
  publisher: string;
}

export const FeedSchema = SchemaFactory.createForClass(Feed);
