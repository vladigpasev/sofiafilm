import { Controller, Get, UseGuards, Post, Body, Patch, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { EmailService } from '../email/email.service';  // Импортиране на EmailService

@ApiTags('Orders')
@ApiBearerAuth() // за защита с токен
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly emailService: EmailService  // Внедряване на EmailService
  ) {}

  @UseGuards(AuthGuard)
  @Get()
  @ApiResponse({ status: 200, description: 'Успешно връщане на всички поръчки.' })
  async findAllOrders() {
    return this.ordersService.findAll();
  }

  @Post()
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({ status: 201, description: 'Поръчката е създадена успешно.' })
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.createOrder(createOrderDto);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', description: 'ID на поръчката' })
  @ApiBody({ description: 'Полето за актуализиране на статус', schema: { type: 'object', properties: { status: { type: 'string', enum: ['approved', 'disapproved', 'unset'] }, inevent: { type: 'boolean' }}}})
  @ApiResponse({ status: 200, description: 'Успешно актуализиране на поръчката.' })
  async updateOrderStatus(@Param('id') id: string, @Body() updateData: { status?: string, inevent?: boolean }) {
    const updatedOrder = await this.ordersService.updateOrderStatus(id, updateData);

    // Логика за изпращане на имейли според новия статус
    if (updateData.status === 'approved') {
      await this.emailService.sendApprovalEmail(updatedOrder.customerEmail);
    } else if (updateData.status === 'disapproved') {
      await this.emailService.sendDisapprovalEmail(updatedOrder.customerEmail);
    }

    return updatedOrder;
  }
}
