import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/exception-filters/http-exception.filter';

async function bootstrap() {
  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    const configService = app.get<ConfigService>(ConfigService);
    const APP = configService.get<string>('APP');
    const PORT = configService.get<number>('PORT') || 3000;
    const ENV = configService.get<string>('NODE_ENV');
    const VERSION = configService.get<string>('VERSION');

    const { httpAdapter } = app.get(HttpAdapterHost);

    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.useGlobalFilters(new HttpExceptionFilter(httpAdapter));

    const config = new DocumentBuilder()
      .setTitle(APP)
      .setDescription(`${APP} - ${ENV}`)
      .setVersion(`${VERSION}`)
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header'
        },
        'JWT-token'
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);

    const customOptions: SwaggerCustomOptions = {
      swaggerOptions: {
        filter: true,
        persistAuthorization: true,
        tagsSorter: 'alpha'
      }
    };

    SwaggerModule.setup('api', app, document, customOptions);

    await app.listen(PORT);
    const url = await app.getUrl();

    Logger.verbose(`Application ${APP} is running on: ${url} ✔️`);
    Logger.verbose(`Api documentation run on: ${url}/api ✔️`);
  } catch (error) {
    Logger.error(`❌❌❌ ${error.message} ❌❌❌`);
  }
}

bootstrap();
