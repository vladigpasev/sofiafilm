import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './order.schema';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

  private generateVerificationCode(): string {
    return Math.floor(10000 + Math.random() * 90000).toString();  // Генерира 5-цифрен код
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel.find().exec();
  }

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const createdOrder = new this.orderModel(createOrderDto);
    return createdOrder.save();
  }
  

  async updateOrderStatus(id: string, updateData: { status?: string, inevent?: boolean }): Promise<Order> {
    const updatedFields = {};
    
    if (updateData.status) {
      updatedFields['status'] = updateData.status;
    }
    if (typeof updateData.inevent === 'boolean') {
      updatedFields['inevent'] = updateData.inevent;
    }

    return this.orderModel.findByIdAndUpdate(id, updatedFields, { new: true }).exec();
  }
}
