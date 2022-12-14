import cors from 'cors';
import 'express-async-errors';
import { Application, json, NextFunction, Request, Response, urlencoded } from 'express';
import helmet from 'helmet';
import errorHandler from './errorHandler';
import LoggerInit from './logger';
import routes from '../api-gateway';

const expressConfig = (app: Application) => { 
  const appPackage = app.get('APP_PACKAGE');

  const logger = LoggerInit.createLogger({ label: appPackage.name });
  global.logger = logger;

  app.use(cors({  exposedHeaders: ['Authorization'] }));
  app.use(json());
  app.use(urlencoded({ extended: true }));
  app.use(helmet());
  app.disable('x-powered-by');

  app.use((_req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Origin, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
  });

  routes(app);
  app.use((_req: Request, res: Response) => res.status(404).json({
    status: 'Not Found',
    message: 'oooops! page not found',
  }));
  
  app.use(errorHandler);
};

export default expressConfig;
