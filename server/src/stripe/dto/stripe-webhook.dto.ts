import { ApiProperty } from '@nestjs/swagger';

export class StripeWebhookDto {
  @ApiProperty({ example: 'evt_1JUYGyLgbh4mCUzXIv95JYw5', description: 'ID на събитието от Stripe' })
  id: string;

  @ApiProperty({ example: 'checkout.session.completed', description: 'Тип на събитието' })
  type: string;

  @ApiProperty({ description: 'Данни за събитието от Stripe' })
  data: any;
}
