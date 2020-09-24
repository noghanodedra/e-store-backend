import { Request, Response } from 'express';

export class AuthController {
  public login(req: Request, res: Response): void {
    res.json({
      message: 'test',
    });
  }

  public logout(req: Request, res: Response): void {
    res.json({
      message: 'test',
    });
  }

  public refreshToken(req: Request, res: Response): void {
    res.json({
      message: 'test',
    });
  }
}
