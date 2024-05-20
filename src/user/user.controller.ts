import { Controller, Post, Body, Get, UseGuards, Request, Patch, UseInterceptors, UploadedFile, Param, ParseFilePipeBuilder, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDTO } from './dto/register.dto';
import { UpdateDTO} from './dto/update.dto'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { FileInterceptor } from '@nestjs/platform-express';

import { MulterOptions } from '../config/upload.config';



@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get('/')
  status() {
    return "hello"
  }

  @Post('/register')
  create(@Body() registerDto: RegisterDTO) {
    return this.userService.create(registerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/update')
  @UseInterceptors(FileInterceptor('file', MulterOptions))
  async uploadFile(@Request() req, @UploadedFile()
    file: Express.Multer.File, @Body() updateDTO: UpdateDTO,) {
    
    
    // console.log(file)

    let filename = file.filename
    // Save the file information to the database
    const updatedUser = await this.userService.updateUser(req.user.userId , updateDTO, filename);

    return updatedUser
  }


  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  async getProfile(@Request() req) {
    console.log(req.user.email)
    const user = await this.userService.findByEmail(req.user.email)

    const profilePicUrl = (await user).picProfile ? `http://localhost:3000/${(await user).picProfile}` : null;

    return {
      ...user,
      profilePicUrl,
    };

  }

}
