import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { OrdersModule } from '../orders/orders.module'; // Import OrdersModule for OrdersService
import { EmailModule } from '../email/email.module'; // Import the EmailModule to use EmailService

@Module({
  imports: [OrdersModule, EmailModule], // Make sure EmailModule is imported
  providers: [StripeService],
  controllers: [StripeController],
})
export class StripeModule {}
