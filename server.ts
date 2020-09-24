import 'dotenv/config';
import 'module-alias/register';
import 'reflect-metadata';

import * as bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import { ConnectionOptions, createConnection } from 'typeorm';

import envConfig from './src/configs';
import { Routes } from './src/routes';

class App {
  public app: express.Application;
  private routes: Routes = new Routes();

  constructor() {
    this.app = express();
    this.config();
    this.dbSetup();
    this.routes.routes(this.app);
  }

  private config(): void {
    const corsConfig = {
      origin: envConfig.originUrl,
      credentials: true,
    };
    this.app.use(cors(corsConfig));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.disable('x-powered-by'); // disable X-Powered-By header
    this.app.use(compression());
    const PORT = envConfig.port || 4000;
    this.app.listen(PORT, () => {
      console.log(`🚀 Server ready at http://localhost:${PORT}`);
    });
  }

  private dbSetup(): void {
    const connectToDatabase = async (): Promise<void> => {
      const typeormconfig = this.getTypeOrmConfig();
      console.log(typeormconfig);
      await createConnection(typeormconfig);
    };
    connectToDatabase()
      .then(async () => {
        console.log('Connected to database');
      })
      .catch((err) => console.log(err));
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
      logging: envConfig.db.logging === 'true' ? true : false,
      synchronize: envConfig.db.synchronize === 'true' ? true : false,
      logger: 'advanced-console',
    };
  }
}
export default new App().app;
