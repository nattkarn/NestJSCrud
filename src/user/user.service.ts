import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema'; // Import UserDocument

import { RegisterDTO } from './dto/register.dto';
import { UpdateDTO } from './dto/update.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {} // Use UserDocument type

  async create(registerDTO: RegisterDTO): Promise<User> {
    const newUser = new this.userModel(registerDTO);
    return await newUser.save();
  }

  async updateUser(id: string, updateDTO: UpdateDTO, fileName:string){
    
    const user = await this.userModel.findById(id).exec()
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const result = await this.userModel.findByIdAndUpdate(id, updateDTO, {new:true}).exec();
    result.picProfile = fileName
    await result.save()
    return result
  }


  async findByEmail(email: string): Promise<User>{

    const user = this.userModel.findOne({email}).exec()

    if(!user){
      throw new BadRequestException('User not found')
    }
    return user
    
  }

}
