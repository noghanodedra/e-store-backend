import { Application } from 'express';
import AuthRouter from './api/auth/auth.routes';
import SignUpRouter from './api/sign-up/sign-up.routes';
import envConfig from './configs';

export class Routes {
  public routes(app: Application): void {
    const routePrefix = envConfig.routePrefix;
    app.use(routePrefix + '/auth', new AuthRouter().routes());
    app.use(routePrefix + '/sign-up', new SignUpRouter().routes());
  }
}
