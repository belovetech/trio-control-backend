import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class ExceptionsLoggerFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus ? exception.getStatus() : 500;

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message,
      errors: status === 400 ? this.getErrorMessage(exception) : undefined,
    });
  }

  private getErrorMessage(exception: HttpException): string | object {
    const messages = exception.getResponse()['message'];

    if (typeof messages === 'string') {
      return messages;
    }

    const messagesObject: { [key: string]: string } = {};
    for (const error of messages) {
      messagesObject[error.split(' ')[0]] = error;
    }

    return messagesObject;
  }
}
