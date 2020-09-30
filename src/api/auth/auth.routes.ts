import express, { Router } from 'express';

import { AuthController } from './auth.controller';

export default class Routes {
  private loginURI = '/login';
  private logoutURI = '/logout';
  private refreshTokenURI = '/refreshToken';
  private meURI = '/me';

  private controller: AuthController;

  constructor() {
    this.controller = new AuthController();
  }

  public routes(): Router {
    const router = express.Router();
    router.route(this.loginURI).post(this.controller.login);
    router.route(this.logoutURI).delete(this.controller.logout);
    router.route(this.refreshTokenURI).post(this.controller.refreshToken);
    router.route(this.meURI).post(this.controller.me);
    return router;
  }
}
