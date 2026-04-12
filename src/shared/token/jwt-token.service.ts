import {TextEncoder} from 'node:util';
import {inject, injectable} from 'inversify';
import {SignJWT, jwtVerify, errors} from 'jose';
import {StatusCodes} from 'http-status-codes';
import {type Config} from '../config/config.interface.js';
import {HttpError} from '../http-error/http-error.js';
import {Component} from '../types/component.js';
import {type TokenPayload} from './token-payload.interface.js';
import {type TokenService} from './token-service.interface.js';

const JWT_ALGORITHM = 'HS256';
const TOKEN_EXPIRATION = '7d';

@injectable()
export class JwtTokenService implements TokenService {
  private readonly secret: Uint8Array;

  constructor(@inject(Component.Config) config: Config) {
    this.secret = new TextEncoder().encode(config.get('JWT_SECRET'));
  }

  public async createToken(payload: TokenPayload): Promise<string> {
    return new SignJWT(payload)
      .setProtectedHeader({alg: JWT_ALGORITHM})
      .setIssuedAt()
      .setExpirationTime(TOKEN_EXPIRATION)
      .sign(this.secret);
  }

  public async verifyToken(token: string): Promise<TokenPayload> {
    try {
      const {payload} = await jwtVerify(token, this.secret);

      if (typeof payload.userId !== 'string') {
        throw new HttpError(StatusCodes.UNAUTHORIZED, 'Token payload is invalid');
      }

      return {userId: payload.userId};
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }

      if (error instanceof errors.JOSEError) {
        throw new HttpError(StatusCodes.UNAUTHORIZED, 'Token is invalid');
      }

      throw error;
    }
  }
}
