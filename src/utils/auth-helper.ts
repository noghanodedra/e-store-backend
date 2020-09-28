import { User } from '@entities/user';
import { sign, verify } from 'jsonwebtoken';

import envConfig from '../configs';
import { CommonConstants } from '../constants/common';

export class AuthHelper {
  public static createAccessToken(user: User): string {
    return sign(
      {
        user: AuthHelper.getUserDetails(user),
      },
      envConfig.jwt.accessTokenSecret!,
      {
        expiresIn: envConfig.jwt.accessTokenExpiryTime,
      }
    );
  }

  public static createRefreshToken(user: User): string {
    return sign(
      {
        user: {
          ...AuthHelper.getUserDetails(user),
          tokenVersion: user.tokenVersion,
        },
      },
      envConfig.jwt.refreshTokenSecret!,
      {
        expiresIn: envConfig.jwt.refreshTokenExpiryTime,
      }
    );
  }

  public static validateAccessToken(token: string): any {
    try {
      return verify(token, envConfig.jwt.accessTokenSecret!);
    } catch (e) {
      return '';
    }
  }

  public static validateRefreshToken(token: string): any {
    try {
      return verify(token, envConfig.jwt.refreshTokenSecret!);
    } catch (e) {
      return '';
    }
  }

  public static getTokens(user: User): any {
    const accessToken = AuthHelper.createAccessToken(user);
    const refreshToken = AuthHelper.createRefreshToken(user);
    return { accessToken, refreshToken };
  }

  public static tokenCookies (tokens: any): any {
    const { accessToken, refreshToken } = tokens;
    const cookieOptions = {
      // httpOnly: envConfig.jwt.httpOnly,
      // secure: envConfig.jwt.secureCookie,
      // domain: "your-website.com",
      // SameSite: None
    };
    return {
      access: [CommonConstants.ACCESS_COOKIE, accessToken, cookieOptions],
      refresh: [CommonConstants.REFRESH_COOKIE, refreshToken, cookieOptions],
    };
  }

  private static getUserDetails(user: User): object {
    return {
      email: user.email,
      fullName: user.fullName,
      lastLoggedIn: user.lastLoggedIn,
    };
  }
}
