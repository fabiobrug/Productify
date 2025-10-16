import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './products.model'; //importando o modelo de produto  
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product)
    private productModel: typeof Product,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      const product = await this.productModel.create({...createProductDto});
      return product;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  async findAll() : Promise<Product[]> {
    return this.productModel.findAll({
      order: [['id', 'ASC']]
    });
  }

  async findOne(id: number) : Promise<Product | null> {
    return this.productModel.findByPk(id);
  }

  async update(id: number, updateProductDto: UpdateProductDto) : Promise<Product | null> {
    const [affectedCount] = await this.productModel.update({...updateProductDto}, { where: { id } });
    
    if (affectedCount === 0) {
      return null;
    }
    
    return this.findOne(id);
  }

  async remove(id: number) : Promise<void> {
    const product = await this.findOne(id);
    if (product) {
      await product.destroy();
    }
  }
}
