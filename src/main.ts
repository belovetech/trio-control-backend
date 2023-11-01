import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ErrorMiddleware } from './common/middlewares/error.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(new ErrorMiddleware().use);
  await app.listen(3000);
}
bootstrap();
