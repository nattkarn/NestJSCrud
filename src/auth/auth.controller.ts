import { Controller, Post, Get, Request, UseGuards, Res} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard'
import { GoogleAuthGuard } from './google-auth.guard'


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req, @Res({ passthrough:true}) res){
    const { accessToken } = await this.authService.login(req.user);
    res.cookie('access_token', 'Test');
    return {
      message: 'Login successful'
    }
  }

  // @UseGuards(LocalAuthGuard)
  @Get('/test')
  async test(@Res({ passthrough:true}) res){
    const  accessToken  = "test";
    res.cookie('access_token', accessToken);
    return {
      message: 'Login successful'
    }
  }

  // เพิ่มส่วนที่เกี่ยวกับ google
  @UseGuards(GoogleAuthGuard)
  @Get('google')
  async googleAuth(@Request() req) {
    // Initiates the Google OAuth process
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleAuthRedirect(@Request() req, @Res( {passthrough:true }) res) {
    const { accessToken } = await this.authService.googleLogin(req);
    res.cookie('access_token', accessToken, {
      httpOnly: true,
    });
    return {
      message: 'Login successful'
    }
  }

   // เพิ่ม logout
   @Get('logout')
   async logout(@Request() req, @Res() res) {
     res.clearCookie('access_token', {
       httpOnly: true,
     });
     return res.json({ message: 'Successfully logged out' });
   }
 
}
