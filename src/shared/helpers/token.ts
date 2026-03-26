import {StatusCodes} from 'http-status-codes';
import {HttpError} from '../http-error/http-error.js';

const AUTH_SCHEME = 'Bearer';

export const createAuthToken = (userId: string): string => userId;

export const parseAuthToken = (authorizationHeader?: string): string => {
  if (!authorizationHeader) {
    throw new HttpError(StatusCodes.UNAUTHORIZED, 'Authorization header is missing');
  }

  const [scheme, token] = authorizationHeader.split(' ');

  if (scheme !== AUTH_SCHEME || !token) {
    throw new HttpError(StatusCodes.UNAUTHORIZED, 'Invalid authorization header format');
  }

  return token;
};
