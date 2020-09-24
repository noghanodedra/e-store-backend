import express, { Router } from 'express';
import { SignUpController } from './sign-up.controller';

export default class Routes {

  private resourceName = '/';
  private controller: SignUpController;

  constructor() {
    this.controller = new SignUpController();
  }

  public routes(): Router {
    const router = express.Router();
    router.route(this.resourceName).post(this.controller.create);
    return router;
  }
}
