import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request, Response } from 'express';
import * as clc from 'cli-color';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  private formatRequest(request: Request): string {
    const { method, originalUrl, ip, body, query, params } = request;
    const userAgent = request.get('user-agent') || '';

    return [
      `${clc.green('REQUEST:')} ${clc.yellow(method)} ${originalUrl}`,
      `From: ${ip} ${userAgent}`,
      `Body: ${JSON.stringify(body, null, 2)}`,
      `Query: ${JSON.stringify(query, null, 2)}`,
      `Params: ${JSON.stringify(params, null, 2)}`,
    ].join('\n');
  }

  private formatResponse(
    method: string,
    url: string,
    statusCode: number,
    delay: number,
    data?: any,
  ): string {
    const statusColor = statusCode >= 400 ? clc.red : clc.green;

    return [
      `${clc.blue('RESPONSE:')} ${clc.yellow(method)} ${url}`,
      `Status: ${statusColor(statusCode)}`,
      `Time: ${delay}ms`,
      data && `Data: ${JSON.stringify(data, null, 2)}`,
    ]
      .filter(Boolean)
      .join('\n');
  }

  private formatError(
    method: string,
    url: string,
    status: number,
    message: string,
    stack: string,
    delay: number,
  ): string {
    return [
      `${clc.red('ERROR:')} ${clc.yellow(method)} ${url}`,
      `Status: ${clc.red(status)}`,
      `Time: ${delay}ms`,
      `Message: ${message}`,
      `Stack: ${stack.split('\n')[0]}`, // Hanya baris pertama stack trace
    ].join('\n');
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const now = Date.now();

    // Log request
    this.logger.log(this.formatRequest(request));

    return next.handle().pipe(
      tap({
        next: data => {
          const delay = Date.now() - now;
          this.logger.log(
            this.formatResponse(
              request.method,
              request.url,
              response.statusCode,
              delay,
              process.env.NODE_ENV === 'development' ? data : undefined,
            ),
          );
        },
        error: err => {
          const delay = Date.now() - now;
          this.logger.error(
            this.formatError(
              request.method,
              request.url,
              err.status || 500,
              err.message,
              err.stack,
              delay,
            ),
          );
        },
      }),
    );
  }
}
