import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './orders.model';
import { Product } from '../products/products.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order)
    private orderModel: typeof Order,
    @InjectModel(Product)
    private productModel: typeof Product,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    try {
      // Buscar os produtos para obter nome e preço
      const productIds = createOrderDto.items.map(item => item.productId);
      const products = await this.productModel.findAll({
        where: { id: productIds }
      });

      if (products.length !== productIds.length) {
        throw new NotFoundException('Um ou mais produtos não foram encontrados');
      }

      // Criar o array de itens com informações completas
      const orderItems = createOrderDto.items.map(item => {
        const product = products.find(p => p.id === item.productId);
        if (!product) {
          throw new NotFoundException(`Produto com ID ${item.productId} não encontrado`);
        }
        return {
          productId: item.productId,
          productName: product.name,
          productPrice: parseFloat(product.price.toString()),
          quantity: item.quantity,
        };
      });

      // Calcular o total
      const totalAmount = orderItems.reduce(
        (total, item) => total + (item.productPrice * item.quantity),
        0
      );

      const order = await this.orderModel.create({
        items: orderItems,
        totalAmount,
        status: 'pending',
      });

      return order;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel.findAll({
      order: [['createdAt', 'DESC']],
    });
  }

  async findOne(id: number): Promise<Order | null> {
    return this.orderModel.findByPk(id);
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order | null> {
    const [affectedCount] = await this.orderModel.update(
      { ...updateOrderDto },
      { where: { id } }
    );

    if (affectedCount === 0) {
      return null;
    }

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const order = await this.findOne(id);
    if (order) {
      await order.destroy();
    }
  }

  async confirmOrder(id: number): Promise<Order | null> {
    return this.update(id, { status: 'confirmed' });
  }

  async cancelOrder(id: number): Promise<Order | null> {
    return this.update(id, { status: 'cancelled' });
  }
}
