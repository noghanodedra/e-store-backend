import dotenv from 'dotenv';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

export default {
  host: process.env.APP_HOST,
  port: process.env.APP_PORT,
  routePrefix: process.env.APP_ROUTE_PREFIX || '',
  environment: process.env.NODE_ENV || 'development',
  originUrl: process.env.ORIGIN_URL || '',
  db: {
    type: process.env.TYPEORM_CONNECTION,
    host: process.env.TYPEORM_HOST,
    port: process.env.TYPEORM_PORT,
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
    synchronize: process.env.TYPEORM_SYNCHRONIZE,
    logging: process.env.TYPEORM_LOGGING,
    entities: process.env.TYPEORM_ENTITIES,
    migrations: process.env.TYPEORM_MIGRATIONS,
  },
  jwt: {
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
    accessTokenExpiryTime: process.env.ACCESS_TOKEN_EXPIRY_TIME,
    refreshTokenExpiryTime: process.env.REFRESH_TOKEN_EXPIRY_TIME,
    httpOnly: process.env.HTTP_ONLY,
    secureCookie: process.env.SECURE_COOKIE,
  },
};
