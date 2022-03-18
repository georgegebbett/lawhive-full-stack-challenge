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

  @Prop()
  feeStructure: 'No-Win-No-Fee' | 'Fixed-Fee';

  @Prop()
  feeAmount: number;

  @Prop()
  paymentAmount: number;
}

export const JobSchema = SchemaFactory.createForClass(Job);
