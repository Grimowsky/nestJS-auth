import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaKnownClientExceptions } from './common/prisma-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //prisma setup errors
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaKnownClientExceptions(httpAdapter));

  await app.listen(3000);
}
bootstrap();
