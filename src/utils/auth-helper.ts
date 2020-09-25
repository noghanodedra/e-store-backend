import envConfig from '@configs';
import { User } from '@entities/user';
import { sign, verify } from 'jsonwebtoken';

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

  public static validateAccessToken(token: string): string | object {
    try {
      return verify(token, envConfig.jwt.accessTokenSecret!);
    } catch (e) {
      return '';
    }
  }

  public static validateRefreshToken(token: string): string | object {
    try {
      return verify(token, process.env.REFRESH_TOKEN_SECRET!);
    } catch (e) {
      return '';
    }
  }

  public static setTokens(user: User): object {
    const accessToken = AuthHelper.createAccessToken(user);
    const refreshToken = AuthHelper.createRefreshToken(user);
    return { accessToken, refreshToken };
  }

  private static getUserDetails(user: User): object {
    return {
      email: user.email,
      fullName: user.fullName,
      lastLoggedIn: user.lastLoggedIn,
    };
  }

}
