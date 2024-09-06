import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Order } from '@prisma/client'; // Import Prisma Order type

@Injectable()
export class OrdersService {

  constructor(private readonly prisma: PrismaService) {}

  // Create a new order
  create(createOrderDto: CreateOrderDto): Promise<Order> {
    return this.prisma.order.create({
      data: {
        productId: createOrderDto.productId,
        quantity: createOrderDto.quantity
      },
    });
  }

  // Find all orders
  async findAll(): Promise<Order[]> {
    return this.prisma.order.findMany({
      include: {
        product: true, // Include the related product information
      },
    });
  }

  // Find one order by ID
  async findOne(id: number): Promise<Order> {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        product: true, // Include the related product information
      },
    });
  }

  // Remove an order by ID
  async remove(id: number): Promise<Order> {
    return this.prisma.order.delete({
      where: { id },
    });
  }
}
