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
    return next(new UnauthorizedError('Access is forbidden'));
  }
  return next();

  /*
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
    const userTokens = AuthHelper.setTokens(user);
    req.user = decodedRefreshToken.user;
    req.token = userTokens.accessToken;
    // update the cookies with new tokens
    const cookies = AuthHelper.tokenCookies(userTokens);
    res.clearCookie('access');
    res.clearCookie('refresh');
    res.cookie(cookies.access[0], cookies.access[1], cookies.access[2]);
    res.cookie(cookies.refresh[0], cookies.refresh[1], cookies.refresh[2]);
    return next();
  }
   */
};
