// @ts-nocheck
import { Request, Response } from 'express';

import { AuthHelper } from './auth-helper';
import { UnauthorizedError } from './errors';

export const ValidateTokensMiddleware = async (
  req: Request,
  res: Response,
  next: any
) => {
  if (req.url.indexOf('/login') >= 0) {
    return next();
  }
  const accessToken = req.cookies.access;
  const decodedAccessToken = AuthHelper.validateAccessToken(accessToken);
  if (!decodedAccessToken || !decodedAccessToken.user) {
    res.clearCookie('access');
    res.clearCookie('refresh');
    return next(new UnauthorizedError('Access is denied'));
  }
  return next();
};
