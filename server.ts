import 'dotenv/config';
import 'module-alias/register';
import 'reflect-metadata';

import * as bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import Container from 'typedi';
import { ConnectionOptions, createConnection, useContainer } from 'typeorm';

import envConfig from './src/configs';
import { Routes } from './src/routes';
import { handleErrors } from './src/utils/handle-errors';
import { ValidateTokensMiddleware } from './src/utils/validate-tokens-middleware';

useContainer(Container);

class App {
  public app: express.Application;
  private routes: Routes = new Routes();

  constructor() {
    this.app = express();
    this.config();
    this.routes.routes(this.app);
    this.app.use(handleErrors);
  }

  private config(): void {
    const corsConfig = {
      origin: envConfig.originUrl,
      credentials: true,
    };
    this.app.use(cookieParser());
    this.app.use(cors(corsConfig));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.disable('x-powered-by'); // disable X-Powered-By header
    this.app.use(compression());
    this.app.use(ValidateTokensMiddleware);
  }

  // tslint:disable-next-line: member-ordering
  public async dbSetup(): Promise<void> {
      const typeormconfig = this.getTypeOrmConfig();
      // console.log(typeormconfig);
      await createConnection(typeormconfig);
      console.log('Connected to DB');
      return;
  }

  private getTypeOrmConfig(): ConnectionOptions {
    return {
      type: 'mongodb',
      host: envConfig.db.host,
      port: parseInt(envConfig.db.port || '27017', 10),
      database: envConfig.db.database,
      username: envConfig.db.username,
      password: envConfig.db.password,
      entities: [__dirname + envConfig.db.entities],
      logging: 'all', // envConfig.db.logging, // ['error' , 'query', 'all']
      synchronize: envConfig.db.synchronize === 'true' ? true : false,
      logger: 'advanced-console',
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dropSchema: envConfig.db.dropSchema === 'true' ? true : false,
    };
  }
}
export default App;
