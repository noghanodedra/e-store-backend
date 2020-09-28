import { User } from '@entities/user';
import { UserService } from '@shared/user.service';
import { GeneralError } from '@utils/errors';
import validationSchema from '@utils/validation-schemas';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Container } from 'typedi';

export class SignUpController {
  public async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const params = req.body;
      const { error } = validationSchema.signUp.create.validate(params, {
        abortEarly: false,
      });
      if (error?.details) {
        res.status(StatusCodes.CONFLICT).json(error?.details);
      } else {
        const userService: UserService = Container.get(UserService);
        const user = new User();
        user.fullName = params.fullName;
        user.email = params.email;
        user.password = params.password;
        user.lastLoggedIn = new Date();
        user.active = true;
        user.avatarUrl = '';
        const { password, ...result } = await userService.create(user);
        res.status(StatusCodes.CREATED).json({ result });
      }
    } catch (error: GeneralError | any) {
      next(error);
    }
  }
}
