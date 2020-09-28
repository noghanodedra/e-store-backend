import { CommonConstants } from '@constants/common';
import { CommonMessages } from '@constants/messages';
import { User } from '@entities/user';
import { UserService } from '@shared/user.service';
import { AuthHelper } from '@utils/auth-helper';
import { BadRequest, GeneralError } from '@utils/errors';
import validationSchema from '@utils/validation-schemas';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Container from 'typedi';

export class AuthController {
  public async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const params = req.body;
      const { error } = validationSchema.auth.login.validate(params, {
        abortEarly: false,
      });
      if (error?.details) {
        res.status(StatusCodes.CONFLICT).json(error?.details);
      } else {
        const { username, password } = params;
        const userService: UserService = Container.get(UserService);
        const tokens = await userService.login(username, password);
        const cookies = AuthHelper.tokenCookies(tokens);
        res.clearCookie(CommonConstants.ACCESS_COOKIE);
        res.clearCookie(CommonConstants.REFRESH_COOKIE);
        res.cookie(cookies.access[0], cookies.access[1], cookies.access[2]);
        res.cookie(cookies.refresh[0], cookies.refresh[1], cookies.refresh[2]);
        res.status(StatusCodes.OK).json({ ...tokens });
      }
    } catch (error: GeneralError | any) {
      next(error);
    }
  }

  public async logout(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const refreshToken = req.cookies.refresh;
      if (!refreshToken) {
        throw new BadRequest(CommonMessages.BAD_REQUEST);
      } else {
        const userService: UserService = Container.get(UserService);
        await userService.logout(refreshToken);
        res.clearCookie(CommonConstants.ACCESS_COOKIE);
        res.clearCookie(CommonConstants.REFRESH_COOKIE);
        res.status(StatusCodes.NO_CONTENT).send();
      }
    } catch (error: GeneralError | any) {
      next(error);
    }
  }

  public async refreshToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const refreshToken = req.cookies.refresh;
      if (!refreshToken) {
        throw new BadRequest(CommonMessages.BAD_REQUEST);
      } else {
        res.clearCookie(CommonConstants.ACCESS_COOKIE);
        res.clearCookie(CommonConstants.REFRESH_COOKIE);
        const userService: UserService = Container.get(UserService);
        const tokens = await userService.refreshToken(refreshToken);
        const cookies = AuthHelper.tokenCookies(tokens);
        res.cookie(cookies.access[0], cookies.access[1], cookies.access[2]);
        res.cookie(cookies.refresh[0], cookies.refresh[1], cookies.refresh[2]);
        res.status(StatusCodes.OK).send({...tokens});
      }
    } catch (error: GeneralError | any) {
      next(error);
    }
  }

  public async me(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const accessToken = req.cookies.access;
      if (!accessToken) {
        throw new BadRequest(CommonMessages.BAD_REQUEST);
      } else {
        const decodedAccessToken = AuthHelper.validateAccessToken(accessToken);
        const userService: UserService = Container.get(UserService);
        const {
          email,
          fullName,
          avatarUrl,
          lastLoggedIn,
        } = (await userService.me(decodedAccessToken.user.email)) as User;
        res
          .status(StatusCodes.OK)
          .json({ email, fullName, avatarUrl, lastLoggedIn });
      }
    } catch (error: GeneralError | any) {
      next(error);
    }
  }
}
