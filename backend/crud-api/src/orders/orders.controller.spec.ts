import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order } from './orders.model';
import { Product } from '../products/products.model';
import { getModelToken } from '@nestjs/sequelize';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: OrdersService;

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

  const mockOrdersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    confirmOrder: jest.fn(),
    cancelOrder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: mockOrdersService,
        },
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

    controller = module.get<OrdersController>(OrdersController);
    service = module.get<OrdersService>(OrdersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an order', async () => {
      const createOrderDto: CreateOrderDto = {
        items: [
          { productId: 1, quantity: 2 },
        ],
      };

      mockOrdersService.create.mockResolvedValue(mockOrder);

      const result = await controller.create(createOrderDto);

      expect(service.create).toHaveBeenCalledWith(createOrderDto);
      expect(result).toEqual(mockOrder);
    });
  });

  describe('findAll', () => {
    it('should return all orders', async () => {
      const orders = [mockOrder];
      mockOrdersService.findAll.mockResolvedValue(orders);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(orders);
    });
  });

  describe('findOne', () => {
    it('should return an order by id', async () => {
      mockOrdersService.findOne.mockResolvedValue(mockOrder);

      const result = await controller.findOne('1');

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockOrder);
    });
  });

  describe('update', () => {
    it('should update an order', async () => {
      const updateOrderDto: UpdateOrderDto = {
        status: 'confirmed',
      };

      const updatedOrder = { ...mockOrder, ...updateOrderDto };
      mockOrdersService.update.mockResolvedValue(updatedOrder);

      const result = await controller.update('1', updateOrderDto);

      expect(service.update).toHaveBeenCalledWith(1, updateOrderDto);
      expect(result).toEqual(updatedOrder);
    });
  });

  describe('confirmOrder', () => {
    it('should confirm an order', async () => {
      const confirmedOrder = { ...mockOrder, status: 'confirmed' as const };
      mockOrdersService.confirmOrder.mockResolvedValue(confirmedOrder);

      const result = await controller.confirmOrder('1');

      expect(service.confirmOrder).toHaveBeenCalledWith(1);
      expect(result).toEqual(confirmedOrder);
    });
  });

  describe('cancelOrder', () => {
    it('should cancel an order', async () => {
      const cancelledOrder = { ...mockOrder, status: 'cancelled' as const };
      mockOrdersService.cancelOrder.mockResolvedValue(cancelledOrder);

      const result = await controller.cancelOrder('1');

      expect(service.cancelOrder).toHaveBeenCalledWith(1);
      expect(result).toEqual(cancelledOrder);
    });
  });

  describe('remove', () => {
    it('should remove an order', async () => {
      mockOrdersService.remove.mockResolvedValue(undefined);

      await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});

