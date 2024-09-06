import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Product } from './entities/product.entity'


@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) { }



  create(createProductDto: CreateProductDto): Promise<Product> {
    return this.prisma.product.create({
      data: {
        name: createProductDto.name,
        description: createProductDto.description,
        price: createProductDto.price
      }
    })

  }

  findAll() {


    return this.prisma.product.findMany({
      include: {
        orders: true
      }
    })
  }

  findOne(id: number) {
    var product = this.prisma.product.findUnique({
      where: {
        id
      }
    })

    return product
  }

  update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {

    try {
      var product = this.prisma.product.update({
        where: {
          id
        },
        data: {
          name: updateProductDto.name,
          description: updateProductDto.description,
          price: updateProductDto.price
        }
      })
      return product
    } catch (err) {
      throw err
    }



  }

  remove(id: number) {
    this.prisma.product.delete({
      where: {
        id
      }
    })
    return 'Product deleted successfully'
  }
}
