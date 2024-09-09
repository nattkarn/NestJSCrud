import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
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


  async findAll() {
    try {
      const getUser = await this.prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          tel: true,
          createdAt: true,
          updatedAt: true,
          isActive: true,
          isDeleted: true
        }, orderBy: { createdAt: 'desc' }
      });


      return getUser
    } catch (error) { throw error; }
  }

  async findOne(id: number) {
    try {
      // Check if the id is provided
      if (!id) {

        throw new HttpException('id is null or undefined', HttpStatus.BAD_REQUEST);
      }

      // Query the user and exclude the password field
      const getUser = await this.prisma.user.findUnique({
        select: {
          id: true,
          email: true,
          name: true,
          tel: true,
          createdAt: true,
          updatedAt: true,
          isActive: true,
          isDeleted: true
        },
        where: {
          id
        }
      });

      // If user is not found, throw an error
      if (!getUser) {

        throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
      }

      // Log the result if necessary
      console.log(getUser);

      // Return the found user
      return getUser;
    } catch (error) {
      // Handle and throw the error
      throw error;
    }
  }


  async checkEmail(email: string) {
    try {
      const getUser = await this.prisma.user.findUnique({

        where: { email }
      });
      if (!getUser) {
        return false
      }
      return true
    } catch (error) {
      throw error;
    }
  }

  async getProfile(id: number) {
    try {
      if (!id) {
        throw new HttpException('id is null or undefined', HttpStatus.BAD_REQUEST);
      }
      const getUser = await this.prisma.user.findUnique({
        select: {
          id: true,
          email: true,
          name: true,
          tel: true,
          createdAt: true,
          updatedAt: true,
          isActive: true,
          isDeleted: true
        },
        where: { id }
      });
      if (!getUser) {
        throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
      }
      return getUser
    } catch (error) {
      throw error;
    }
  }
  async findByEmail(email: string) {
    try {
      // Check if email is provided
      if (!email) {
        throw new HttpException('Email must be provided', HttpStatus.BAD_REQUEST);
      }

      // Find the user by email
      const getUser = await this.prisma.user.findUnique({
        select: {
          id: true,
          email: true,
          password: true,

        },
        where: { email }
      });

      // If user is not found, throw a NotFound exception
      if (!getUser) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      // Return the found user
      return getUser;
    } catch (error) {
      // Rethrow the error for further handling or logging
      throw error;
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    //TODO: Check token for authorization if same user  allows update
    try {
      const getUser = await this.prisma.user.findUnique({
        where: {
          id
        }
      });
      if (!getUser) {

        throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
      }

      // Update the user's fields that are present in the DTO
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: {
          name: updateUserDto.name ?? getUser.name,  // Keep old name if not provided
          tel: updateUserDto.tel ?? getUser.tel,    // Keep old tel if not provided
          // Add other fields you want to update if necessary
        },
      });

      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    //TODO: Check token for authorization if same user  allows delete
    try {
      const getUser = await this.prisma.user.findUnique({
        where: {
          id
        }
      });
      if (!getUser) {
        throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
      }

      const deletedUser = await this.prisma.user.update({
        where: { id },
        data: {
          isDeleted: true
        }
      })
      return 'user deleted';
    }
    catch (error) {
      throw error;
    }
  }
}
