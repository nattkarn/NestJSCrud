import { Controller, Post, Body, HttpCode, HttpStatus, Request, UseGuards, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from 'src/strategies/local-auth.guard';



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('/login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async login(@Request() req, @Res({ passthrough: true }) res) {
    
    const  userData = await this.authService.login(req.user);
    // console.log('access_token', userData)

    res.cookie('token', userData.user.access_token, {
      httpOnly: true,
    });


    return userData;
  }

}
