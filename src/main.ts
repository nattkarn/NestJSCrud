import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    exceptionFactory: (errors) => {
      // ตัวเลือกนี้ทำให้สามารถกำหนดรูปแบบของ error response เมื่อการตรวจ validation ล้มเหลวได้
      const messages = errors.map((error) => ({
        field: error.property,
        message: Object.values(error.constraints).join('. ') + '.',
      }));
      return new BadRequestException({ errors: messages });
    },
  }));


  await app.listen(5000);
}
bootstrap();
