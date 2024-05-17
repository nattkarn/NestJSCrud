import { Controller,Post, Body, Get, UseGuards,Request } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDTO } from './dto/register.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  status(){
    return "hello"
  }

  @Post('/register')
  create(@Body() registerDto: RegisterDTO) {
    return this.userService.create(registerDto);
  }


  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  async getProfile(@Request() req){
    console.log(req)
    const user = await this.userService.findByEmail(req.user.email)
    return user
  }

}
