import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order, OrderSchema } from './order.schema';
import { EmailModule } from '../email/email.module';  // Import EmailModule

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    EmailModule,  // Make EmailService available
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],  // Export OrdersService if needed in other modules
})
export class OrdersModule {}
