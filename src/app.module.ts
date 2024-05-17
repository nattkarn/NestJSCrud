import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';



@Module({
  imports: [
    //เพิ่มไว้สำหรับอ่าน .env
    ConfigModule.forRoot({
      isGlobal:true,
      envFilePath: '.env'
    })
    ,
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: `mongodb+srv://nattkarn:QT2SvoNO0p3GuJwT@clustermongo.kbhh4ny.mongodb.net/NestJS?retryWrites=true&w=majority&appName=ClusterMongo`}),
    }),
    ProductsModule,
    OrdersModule,
    AuthModule,
    UserModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
