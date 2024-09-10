import { ApiProperty } from '@nestjs/swagger';

export class CreateCheckoutSessionDto {
  @ApiProperty({ example: 'John Doe', description: 'Име на клиента' })
  name: string;

  @ApiProperty({ example: 'john@example.com', description: 'Имейл на клиента' })
  email: string;

  @ApiProperty({ example: '0898123456', description: 'Телефон на клиента' })
  phone: string;
}
