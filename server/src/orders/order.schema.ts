import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Order extends Document {
  @Prop({ required: true })
  customerName: string;

  @Prop({ required: true })
  customerEmail: string;

  @Prop({ required: true })
  customerPhone: string;

  @Prop({ required: true, default: 50 })
  ticketPrice: number;

  @Prop({ required: true })
  paymentStatus: string;

  @Prop({ default: 'unset', enum: ['approved', 'disapproved', 'unset'] })
  status: string;

  @Prop({ required: true })
  verificationCode: string;  // Ново поле за 5-цифрения код

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: false })  // Ново поле за inevent
  inevent: boolean;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
