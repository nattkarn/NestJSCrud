import { IsString, IsNumber, IsOptional } from 'class-validator';


export class CreateOrderDto {

    @IsNumber()
    productId: number;

    @IsNumber()
    quantity: number;
  }