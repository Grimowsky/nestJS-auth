import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaKnownClientExceptions implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    let httpStatus: HttpStatus | number = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string = 'UNKNOWN_PRISMA_ERR';

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      const code = exception?.code;
      switch (code) {
        //record to udpate not found code
        case 'P2025':
          httpStatus = 404;
          message = 'Resource to update not found';
          break;
        default:
          httpStatus = 503;
      }
    }

    const responseBody = {
      statusCode: httpStatus,
      message,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
