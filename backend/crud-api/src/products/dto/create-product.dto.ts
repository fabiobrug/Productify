import { IsString, IsNumber, IsNotEmpty, MinLength, MaxLength, Min, Max } from 'class-validator';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(100)
    name: string;

    @IsNumber()
    @Min(0.01)
    @Max(999999.99)
    price: number;

    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    @MaxLength(500)
    description: string;
}
