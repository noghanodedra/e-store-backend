import express, { Router } from 'express';
import { AuthController } from './auth.controller';

export default class Routes {
  private loginAction = '/login';
  private logoutAction = '/logout';
  private refreshTokenAction = '/refreshToken';

  private controller: AuthController;

  constructor() {
    this.controller = new AuthController();
  }

  public routes(): Router {
    const router = express.Router();
    router
      .route(this.loginAction)
      .post(this.controller.login);
    router
      .route(this.logoutAction)
      .post(this.controller.logout);
    router
      .route(this.refreshTokenAction)
      .post(this.controller.refreshToken);
    return router;
  }
}