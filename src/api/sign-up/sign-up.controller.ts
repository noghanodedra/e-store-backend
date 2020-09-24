import { Request, Response } from 'express';

export class SignUpController {

  public create(req: Request, res: Response): void {
    res.json({
      message: 'test',
    });
  }

}
