import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type JobDocument = Job & Document;

@Schema()
export class Job {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  state: 'started' | 'paid';
}

export const JobSchema = SchemaFactory.createForClass(Job);
