import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema'; // Import UserDocument

import { RegisterDTO } from './dto/register.dto';
import { UpdateDTO } from './dto/update.dto';

import { v4 as uuidv4 } from 'uuid'; // For generating unique tokens
import { MailerService } from '@nestjs-modules/mailer';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private mailerService : MailerService
  ) {} // Use UserDocument type

  async create(registerDTO: RegisterDTO): Promise<User> {
    const activationToken = uuidv4();
    
    let data ={
      ...registerDTO,
      activationToken:activationToken
    }
    
    const newUser = new this.userModel(data);
    newUser.tokenCreatedAt = new Date();  // Set token creation time
    await newUser.save();

    const activationLink = `http://localhost:3000/user/activation?token=${activationToken}`;

    await this.mailerService.sendMail({
      to: newUser.email,
      subject: 'Account Activation',
      text: `Please activate your account using the following link: ${activationLink}`,
    });

    return newUser
  }

  async activateAccount(token: string): Promise<boolean> {
    const user = await this.userModel.findOne({ activationToken: token });
    if (!user) {
      throw new BadRequestException('token is invalid');
    }
    // Check if the token is expired
    const tokenExpirationTime = 24 * 60 * 60 * 1000; // 24 hours
    const tokenAge = Date.now() - new Date(user.tokenCreatedAt).getTime();
    if (tokenAge > tokenExpirationTime) {
      const activationToken = uuidv4();
      const activationLink = `http://localhost:3000/user/activation?token=${activationToken}`;
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Account Activation is resent',
        text: `Please activate your account using the following link: ${activationLink}`,
      });
      user.activationToken = activationToken
      user.tokenCreatedAt = new Date();  // Set token creation time
      await user.save()
      return false
    }


    user.isVerify = true;
    user.activationToken = null; // Optionally clear the token after activation
    await user.save();
    return true;
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
