import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsOptional, IsString, IsNotEmpty, MinLength, MaxLength, Max, Min, IsNumber } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(100)
    name?: string;

    @IsOptional()
    @IsNumber()
    @IsNotEmpty()
    @Min(0.01)
    @Max(999999.99)
    price?: number;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    @MaxLength(500)
    description?: string;   
}
