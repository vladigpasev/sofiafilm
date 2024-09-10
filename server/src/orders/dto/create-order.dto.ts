import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ example: 'John Doe' })
  customerName: string;

  @ApiProperty({ example: 'john@example.com' })
  customerEmail: string;

  @ApiProperty({ example: '0898123456' })
  customerPhone: string;

  @ApiProperty({ example: 50, default: 50 })
  ticketPrice: number;

  @ApiProperty({ example: 'paid', default: 'pending' })
  paymentStatus: string;

  @ApiProperty({ example: 'unset', enum: ['approved', 'disapproved', 'unset'], default: 'unset', required: false })
  status?: string;

  @ApiProperty({ example: '12345', description: '5-цифрен код за проверка' })
  verificationCode: string;  // Ново поле за кода

  @ApiProperty({ example: false, description: 'Indicates if the customer is in the event', default: false })
  inevent: boolean;  // Ново поле за inevent
}
