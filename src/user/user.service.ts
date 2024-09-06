import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
@Injectable()
export class UserService {

  constructor(private prisma: PrismaService) { }
  async create(createUserDto: CreateUserDto): Promise<{ message: string, data: Partial<User> }> {

    if (!createUserDto) {
      throw new Error('createUserDto is null or undefined');
    }

    const saltOrRounds = 10;
    try {
      const hashPassword = await bcrypt.hash(createUserDto.password, saltOrRounds);
      const user = await this.prisma.user.create({
        data: {
          email: createUserDto.email,
          password: hashPassword,
          name: createUserDto.name,
          tel: createUserDto.tel
        }
      });

      return {
        message: 'user created',
        data: {
          email: user.email,
          name: user.name,
          tel: user.tel
        }
      };

    } catch (error) {
      throw new Error(`Error creating user: ${error}`);
    }
  }


  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
