import { CommonConstants } from '@constants/common';
import { User } from '@entities/user';
import { UserService } from '@shared/user.service';
import { AuthHelper } from '@utils/auth-helper';
import { GeneralError } from '@utils/errors';
import { validateData } from '@utils/validation-helper';
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
      const errors = validateData(params, validationSchema.auth.login);
      if (errors) {
        res.status(StatusCodes.CONFLICT).json(errors);
      } else {
        const { username, password } = params;
        const userService: UserService = Container.get(UserService);
        const tokens = await userService.login(username, password);
        const cookies = AuthHelper.tokenCookies(tokens);
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

      const userService: UserService = Container.get(UserService);
      await userService.logout(refreshToken);
      res.clearCookie(CommonConstants.ACCESS_COOKIE);
      res.clearCookie(CommonConstants.REFRESH_COOKIE);
      res.status(StatusCodes.NO_CONTENT).send();
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
      const userService: UserService = Container.get(UserService);
      const tokens = await userService.refreshToken(refreshToken);
      const cookies = AuthHelper.tokenCookies(tokens);
      res.cookie(cookies.access[0], cookies.access[1], cookies.access[2]);
      res.cookie(cookies.refresh[0], cookies.refresh[1], cookies.refresh[2]);
      res.status(StatusCodes.OK).send({ ...tokens });
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
    } catch (error: GeneralError | any) {
      next(error);
    }
  }
}
