import { Module } from '@nestjs/common';
import { EmailService } from './email.service';

@Module({
  providers: [EmailService],
  exports: [EmailService],  // Export EmailService so other modules can use it
})
export class EmailModule {}
