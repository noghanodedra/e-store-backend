// @ts-nocheck
import { User } from '@entities/user';
import { Request, Response } from 'express';

import { AuthHelper } from './auth-helper';

export const ValidateTokensMiddleware = async (
  req: Request,
  res: Response,
  next: any
) => {
  const refreshToken = req.cookies.refresh;
  const accessToken = req.cookies.access;
  req.token = accessToken;

  const decodedAccessToken = AuthHelper.validateAccessToken(accessToken);
  if (decodedAccessToken && decodedAccessToken.user) {
    req.user = decodedAccessToken.user;
    return next();
  }

  const decodedRefreshToken = AuthHelper.validateRefreshToken(refreshToken);
  if (decodedRefreshToken && decodedRefreshToken.user) {
    const user = await User.findOne({ email: decodedRefreshToken.user.email });
    if (!user || user.tokenVersion !== decodedRefreshToken.user.tokenVersion) {
      // remove cookies if token not valid
      res.clearCookie('access');
      res.clearCookie('refresh');
      req.user = undefined;
      req.token = undefined;
      return next();
    }

    /*
    const userTokens = AuthHelper.setTokens(user);
    req.user = decodedRefreshToken.user;
    req.token = userTokens.accessToken;
    // update the cookies with new tokens
    const cookies = AuthHelper.tokenCookies(userTokens);
    res.clearCookie('access');
    res.clearCookie('refresh');
    res.cookie(cookies.access[0], cookies.access[1], cookies.access[2]);
    res.cookie(cookies.refresh[0], cookies.refresh[1], cookies.refresh[2]);
    */
    return next();
  }
  next();
};
