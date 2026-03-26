import {type NextFunction, type Request, type Response} from 'express';

export interface ExceptionFilter {
  catch(error: Error, request: Request, response: Response, next: NextFunction): void;
}
