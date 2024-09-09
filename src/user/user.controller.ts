import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus,HttpException, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/strategies/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('/profile')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  getProfile(@Request() req) {
    console.log(req.user)
    //TODO: Check token for authorization
    const checkUser = this.userService.checkEmail(req.user.email)

    if(!checkUser){
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    return this.userService.getProfile(req.user.userId)


  }



  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    if(id.length > 10){
      throw new HttpException('id is too long', HttpStatus.BAD_REQUEST);
    }
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}

