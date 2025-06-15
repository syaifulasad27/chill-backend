import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import * as clc from 'cli-color';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  private formatError(
    status: number,
    method: string,
    url: string,
    message: string | string[],
    stack: string,
  ): string {
    return [
      `${clc.red('HTTP ERROR:')} ${clc.yellow(method)} ${url}`,
      `Status: ${clc.red(status)}`,
      `Message: ${Array.isArray(message) ? message.join(', ') : message}`,
      `Stack: ${stack.split('\n')[0]}`,
    ].join('\n');
  }

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message:
        typeof exceptionResponse === 'object' ? exceptionResponse['message'] : exceptionResponse,
    };

    // Log error
    this.logger.error(
      this.formatError(status, request.method, request.url, errorResponse.message, exception.stack),
    );

    response.status(status).json(errorResponse);
  }
}
