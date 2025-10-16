import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { Order } from './orders.model';
import { Product } from '../products/products.model';
import { getModelToken } from '@nestjs/sequelize';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { NotFoundException } from '@nestjs/common';

describe('OrdersService', () => {
  let service: OrdersService;
  let orderModel: typeof Order;
  let productModel: typeof Product;

  const mockProduct = {
    id: 1,
    name: 'Test Product',
    price: 99.99,
    description: 'Test Description',
  };

  const mockOrder = {
    id: 1,
    items: [
      {
        productId: 1,
        productName: 'Test Product',
        productPrice: 99.99,
        quantity: 2,
      },
    ],
    totalAmount: 199.98,
    status: 'pending' as const,
    createdAt: new Date(),
    save: jest.fn(),
    destroy: jest.fn(),
  };

  const mockOrderModel = {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
  };

  const mockProductModel = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getModelToken(Order),
          useValue: mockOrderModel,
        },
        {
          provide: getModelToken(Product),
          useValue: mockProductModel,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    orderModel = module.get<typeof Order>(getModelToken(Order));
    productModel = module.get<typeof Product>(getModelToken(Product));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an order successfully', async () => {
      const createOrderDto: CreateOrderDto = {
        items: [
          { productId: 1, quantity: 2 },
        ],
      };

      mockProductModel.findAll.mockResolvedValue([mockProduct]);
      mockOrderModel.create.mockResolvedValue(mockOrder);

      const result = await service.create(createOrderDto);

      expect(mockProductModel.findAll).toHaveBeenCalledWith({
        where: { id: [1] },
      });
      expect(mockOrderModel.create).toHaveBeenCalledWith({
        items: [
          {
            productId: 1,
            productName: 'Test Product',
            productPrice: 99.99,
            quantity: 2,
          },
        ],
        totalAmount: 199.98,
        status: 'pending',
      });
      expect(result).toEqual(mockOrder);
    });

    it('should throw NotFoundException when product not found', async () => {
      const createOrderDto: CreateOrderDto = {
        items: [
          { productId: 999, quantity: 2 },
        ],
      };

      mockProductModel.findAll.mockResolvedValue([]);

      await expect(service.create(createOrderDto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.create(createOrderDto)).rejects.toThrow(
        'Um ou mais produtos não foram encontrados',
      );
    });

    it('should throw NotFoundException when specific product not found', async () => {
      const createOrderDto: CreateOrderDto = {
        items: [
          { productId: 1, quantity: 2 },
          { productId: 999, quantity: 1 },
        ],
      };

      // Mock para retornar apenas o produto 1, não o 999
      mockProductModel.findAll.mockResolvedValue([mockProduct]);

      await expect(service.create(createOrderDto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.create(createOrderDto)).rejects.toThrow(
        'Um ou mais produtos não foram encontrados',
      );
    });

    it('should handle creation errors', async () => {
      const createOrderDto: CreateOrderDto = {
        items: [
          { productId: 1, quantity: 2 },
        ],
      };

      const error = new Error('Database error');
      mockProductModel.findAll.mockRejectedValue(error);

      await expect(service.create(createOrderDto)).rejects.toThrow(error);
    });
  });

  describe('findAll', () => {
    it('should return all orders', async () => {
      const orders = [mockOrder];
      mockOrderModel.findAll.mockResolvedValue(orders);

      const result = await service.findAll();

      expect(mockOrderModel.findAll).toHaveBeenCalledWith({
        order: [['createdAt', 'DESC']],
      });
      expect(result).toEqual(orders);
    });
  });

  describe('findOne', () => {
    it('should return an order by id', async () => {
      mockOrderModel.findByPk.mockResolvedValue(mockOrder);

      const result = await service.findOne(1);

      expect(mockOrderModel.findByPk).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockOrder);
    });

    it('should return null if order not found', async () => {
      mockOrderModel.findByPk.mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update an order successfully', async () => {
      const updateOrderDto: UpdateOrderDto = {
        status: 'confirmed',
      };

      mockOrderModel.update.mockResolvedValue([1]);
      mockOrderModel.findByPk.mockResolvedValue({
        ...mockOrder,
        ...updateOrderDto,
      });

      const result = await service.update(1, updateOrderDto);

      expect(mockOrderModel.update).toHaveBeenCalledWith(updateOrderDto, {
        where: { id: 1 },
      });
      expect(result).toEqual({ ...mockOrder, ...updateOrderDto });
    });

    it('should return null if order not found for update', async () => {
      const updateOrderDto: UpdateOrderDto = {
        status: 'confirmed',
      };

      mockOrderModel.update.mockResolvedValue([0]);

      const result = await service.update(999, updateOrderDto);

      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should remove an order successfully', async () => {
      mockOrderModel.findByPk.mockResolvedValue(mockOrder);

      await service.remove(1);

      expect(mockOrderModel.findByPk).toHaveBeenCalledWith(1);
      expect(mockOrder.destroy).toHaveBeenCalled();
    });

    it('should handle removal of non-existent order', async () => {
      mockOrderModel.findByPk.mockResolvedValue(null);

      await service.remove(999);

      expect(mockOrderModel.findByPk).toHaveBeenCalledWith(999);
      expect(mockOrder.destroy).not.toHaveBeenCalled();
    });
  });

  describe('confirmOrder', () => {
    it('should confirm an order', async () => {
      const confirmedOrder = { ...mockOrder, status: 'confirmed' as const };
      mockOrderModel.update.mockResolvedValue([1]);
      mockOrderModel.findByPk.mockResolvedValue(confirmedOrder);

      const result = await service.confirmOrder(1);

      expect(mockOrderModel.update).toHaveBeenCalledWith(
        { status: 'confirmed' },
        { where: { id: 1 } },
      );
      expect(result).toEqual(confirmedOrder);
    });
  });

  describe('cancelOrder', () => {
    it('should cancel an order', async () => {
      const cancelledOrder = { ...mockOrder, status: 'cancelled' as const };
      mockOrderModel.update.mockResolvedValue([1]);
      mockOrderModel.findByPk.mockResolvedValue(cancelledOrder);

      const result = await service.cancelOrder(1);

      expect(mockOrderModel.update).toHaveBeenCalledWith(
        { status: 'cancelled' },
        { where: { id: 1 } },
      );
      expect(result).toEqual(cancelledOrder);
    });
  });
});
