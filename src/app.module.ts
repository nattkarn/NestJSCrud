import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';


@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: `mongodb+srv://nattkarn:QT2SvoNO0p3GuJwT@clustermongo.kbhh4ny.mongodb.net/NestJS?retryWrites=true&w=majority&appName=ClusterMongo`}),
    }),
    ProductsModule,
    OrdersModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
