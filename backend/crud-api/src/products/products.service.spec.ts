import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { Product } from './products.model';
import { getModelToken } from '@nestjs/sequelize';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

describe('ProductsService', () => {
  let service: ProductsService;
  let productModel: typeof Product;

  const mockProduct = {
    id: 1,
    name: 'Test Product',
    price: 99.99,
    description: 'Test Description',
    save: jest.fn(),
    destroy: jest.fn(),
  };

  const mockProductModel = {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getModelToken(Product),
          useValue: mockProductModel,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    productModel = module.get<typeof Product>(getModelToken(Product));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a product successfully', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Test Product',
        price: 99.99,
        description: 'Test Description',
      };

      mockProductModel.create.mockResolvedValue(mockProduct);

      const result = await service.create(createProductDto);

      expect(mockProductModel.create).toHaveBeenCalledWith(createProductDto);
      expect(result).toEqual(mockProduct);
    });

    it('should handle creation errors', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Test Product',
        price: 99.99,
        description: 'Test Description',
      };

      const error = new Error('Database error');
      mockProductModel.create.mockRejectedValue(error);

      await expect(service.create(createProductDto)).rejects.toThrow(error);
    });
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      const products = [mockProduct];
      mockProductModel.findAll.mockResolvedValue(products);

      const result = await service.findAll();

      expect(mockProductModel.findAll).toHaveBeenCalledWith({
        order: [['id', 'ASC']],
      });
      expect(result).toEqual(products);
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      mockProductModel.findByPk.mockResolvedValue(mockProduct);

      const result = await service.findOne(1);

      expect(mockProductModel.findByPk).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockProduct);
    });

    it('should return null if product not found', async () => {
      mockProductModel.findByPk.mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a product successfully', async () => {
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product',
        price: 149.99,
      };

      mockProductModel.update.mockResolvedValue([1]);
      mockProductModel.findByPk.mockResolvedValue({
        ...mockProduct,
        ...updateProductDto,
      });

      const result = await service.update(1, updateProductDto);

      expect(mockProductModel.update).toHaveBeenCalledWith(updateProductDto, {
        where: { id: 1 },
      });
      expect(result).toEqual({ ...mockProduct, ...updateProductDto });
    });

    it('should return null if product not found for update', async () => {
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product',
      };

      mockProductModel.update.mockResolvedValue([0]);

      const result = await service.update(999, updateProductDto);

      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should remove a product successfully', async () => {
      mockProductModel.findByPk.mockResolvedValue(mockProduct);

      await service.remove(1);

      expect(mockProductModel.findByPk).toHaveBeenCalledWith(1);
      expect(mockProduct.destroy).toHaveBeenCalled();
    });

    it('should handle removal of non-existent product', async () => {
      mockProductModel.findByPk.mockResolvedValue(null);

      await service.remove(999);

      expect(mockProductModel.findByPk).toHaveBeenCalledWith(999);
      expect(mockProduct.destroy).not.toHaveBeenCalled();
    });
  });
});
