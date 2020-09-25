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
      console.log(error);
      if (error?.details) {
        res.status(StatusCodes.CONFLICT).json(error?.details);
      } else {
        const { username, password } = params;
        const userService: UserService = Container.get(UserService);
        const tokens = await userService.login(username, password);
        const cookies = AuthHelper.tokenCookies(tokens);
        res.clearCookie('access');
        res.clearCookie('refresh');
        res.cookie(cookies.access[0], cookies.access[1], cookies.access[2]);
        // tslint:disable-next-line: no-string-literal
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
      const params = req.body;
      const { error } = validationSchema.auth.logout.validate(params, {
        abortEarly: false,
      });
      console.log(error);
      if (error?.details) {
        res.status(StatusCodes.CONFLICT).json(error?.details);
      } else {
        const { refreshToken } = params;
        const userService: UserService = Container.get(UserService);
        res.clearCookie('access');
        res.clearCookie('refresh');
        // const result = await userService.login(username, password);
        res.status(StatusCodes.NO_CONTENT);
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
        throw new BadRequest('Bad request');
      } else {
        const userService: UserService = Container.get(UserService);

        // const result = await userService.login(username, password);
        res.status(StatusCodes.OK);
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
        throw new BadRequest('Bad request');
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
