import { UserService } from '@shared/user.service';
import { GeneralError } from '@utils/errors';
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
        const result = await userService.login(username, password);
        res.status(StatusCodes.OK).json({ ...result });
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
      const params = req.body;
      const { error } = validationSchema.auth.refreshToken.validate(params, {
        abortEarly: false,
      });
      console.log(error);
      if (error?.details) {
        res.status(StatusCodes.CONFLICT).json(error?.details);
      } else {
        const { refreshToken } = params;
        const userService: UserService = Container.get(UserService);
       
        // const result = await userService.login(username, password);
        res.status(StatusCodes.OK);
      }
    } catch (error: GeneralError | any) {
      next(error);
    }
  }
  
}
