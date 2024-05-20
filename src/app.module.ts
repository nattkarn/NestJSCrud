import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { MulterOptions } from './config/upload.config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..','uploads')
      
  }),
    //เพิ่มไว้สำหรับอ่าน .env
    ConfigModule.forRoot({
      isGlobal:true,
      envFilePath: '.env'
    })
    ,
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI')
      }),
      inject: [ConfigService],
    }),
    ProductsModule,
    OrdersModule,
    AuthModule,
    UserModule,
    MulterModule.register(MulterOptions)
  ],
  controllers: [AppController],
  providers: [AppService,
    
  ],
})

export class AppModule { }
