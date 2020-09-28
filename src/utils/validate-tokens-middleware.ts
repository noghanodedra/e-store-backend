// @ts-nocheck
import { CommonConstants } from '@constants/common';
import { CommonMessages } from '@constants/messages';
import { Request, Response } from 'express';

import { AuthHelper } from './auth-helper';
import { UnauthorizedError } from './errors';

export const ValidateTokensMiddleware = async (
  req: Request,
  res: Response,
  next: any
) => {
  if (req.url.indexOf(CommonConstants.LOGIN_URI) >= 0) {
    return next();
  }
  const accessToken = req.cookies.access;
  const decodedAccessToken = AuthHelper.validateAccessToken(accessToken);
  if (!decodedAccessToken || !decodedAccessToken.user) {
    res.clearCookie(CommonConstants.ACCESS_COOKIE);
    res.clearCookie(CommonConstants.REFRESH_COOKIE);
    return next(new UnauthorizedError(CommonMessages.ACCESS_DENIED));
  }
  return next();
};
