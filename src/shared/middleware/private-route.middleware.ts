import {StatusCodes} from 'http-status-codes';
import {parseAuthToken} from '../helpers/token.js';
import {HttpError} from '../http-error/http-error.js';
import {type TokenService} from '../token/token-service.interface.js';
import {type MiddlewareInterface} from './middleware.interface.js';

export class PrivateRouteMiddleware implements MiddlewareInterface {
  constructor(
    private readonly tokenService: TokenService,
    private readonly isRequired = true
  ) {}

  public async execute(
    req: import('express').Request,
    res: import('express').Response,
    next: import('express').NextFunction
  ): Promise<void> {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      if (!this.isRequired) {
        next();
        return;
      }

      throw new HttpError(StatusCodes.UNAUTHORIZED, 'Authorization token is required');
    }

    const token = parseAuthToken(authorizationHeader);
    const payload = await this.tokenService.verifyToken(token);

    res.locals.userId = payload.userId;
    next();
  }
}
