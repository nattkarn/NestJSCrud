import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { request } from 'http';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super(
      // Read From Header BearerToken
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: configService.get('JWT_SECRET'), // Use the secret from environment variables
        ignoreExpiration: false,
      },

      //Read From Cookie
      // {
      //   jwtFromRequest: ExtractJwt.fromExtractors([
      //     (request) => {
      //       return request?.cookies?.token;
      //     }
      //   ]),
      //   ignoreExpiration: false,
      //   secretOrKey: configService.get('JWT_SECRET'), // Use the secret from environment variables
      // }



    );
  }

  async validate(payload: any) {
    // This payload will be the decrypted token payload you provided when signing the token
    return { userId: payload.sub, email: payload.email };
  }
}