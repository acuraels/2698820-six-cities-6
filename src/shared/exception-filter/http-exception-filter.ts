import {StatusCodes} from 'http-status-codes';
import {inject, injectable} from 'inversify';
import {type NextFunction, type Request, type Response} from 'express';
import {type Logger} from '../libs/logger/logger.interface.js';
import {Component} from '../types/component.js';
import {HttpError} from '../http-error/http-error.js';
import {type ExceptionFilter} from './exception-filter.interface.js';

@injectable()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(@inject(Component.Logger) private readonly logger: Logger) {}

  public catch(error: Error, _request: Request, response: Response, _next: NextFunction): void {
    if (error instanceof HttpError) {
      this.logger.error(`[${error.statusCode}] ${error.message}`);
      response.status(error.statusCode).json({
        message: error.message,
        details: error.details
      });
      return;
    }

    this.logger.error(`[${StatusCodes.INTERNAL_SERVER_ERROR}] ${error.message}`);
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Internal server error'
    });
  }
}
