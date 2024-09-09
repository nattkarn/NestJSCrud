import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {

  constructor(private userService: UserService,
    private jwtService: JwtService

  ) { }
  async validateUser(email: string, pass: string) {

    try {

      const user = await this.userService.findByEmail(email);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
      }

      if (user && (await bcrypt.compare(pass, user.password))) {
        const result = user
        console.log(result)
        return {
          user: {
            id: result.id,
            email: result.email,
          }
        }
      }

      else {
        return null
      }

    }
    catch (error) {
      throw error;
    }
  }

  async login(user: any) {
    try {
      // Check if user has an email
      if (!user || !user.user.email) {
        throw new HttpException('Email must be provided', HttpStatus.BAD_REQUEST);
      }

      // Find the user by email
      const getUser = await this.userService.findByEmail(user.user.email);
      if (!getUser) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      // Create the payload for JWT
      const payload = { sub: getUser.id, email: getUser.email };

      // Generate access token
      const access_token = await this.jwtService.sign(payload);
      if (!access_token) {
        throw new HttpException('Failed to generate access token', HttpStatus.EXPECTATION_FAILED);
      }

      // Return the user and the access token
      return {
        user: {
          email: getUser.email,  // Using email from the found user
          access_token: access_token,
        }
      };
    } catch (error) {
      throw error;
    }
  }
}
