import {type TokenPayload} from './token-payload.interface.js';

export interface TokenService {
  createToken(payload: TokenPayload): Promise<string>;
  verifyToken(token: string): Promise<TokenPayload>;
}
