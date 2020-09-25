import { User } from '@entities/user';
import { UserService } from '@shared/user.service';
import validationSchema from '@utils/validation-schemas';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Container } from 'typedi';

import { GeneralError } from '../../utils/errors';

export class SignUpController {
  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userService: UserService = Container.get(UserService);
      // const { fullName, email, password } = req.body;
      const params = req.body;
      const { error } = validationSchema.signUp.validate(params, {
        abortEarly: false,
      });
      console.log(error);
      if (error?.details) {
        res.status(StatusCodes.CONFLICT).json(error?.details);
      } else {
        const user = new User();
        user.fullName = params.fullName;
        user.email = params.email;
        user.password = params.password;
        user.lastLoggedIn = new Date();
        const {password, ...result} = await userService.create(user);
        res.status(StatusCodes.CREATED).json({ result });
      }
    } catch (error: GeneralError | any) {
      // res.status(error.getCode()).json(error);
      next(error);
    }
  }
}
