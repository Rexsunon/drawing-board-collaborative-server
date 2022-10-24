import welcomeRoutes from './modules/welcome/router';
import { Application } from 'express';

const routes = (app: Application) => {
  app.use(`/`, welcomeRoutes);
//   app.use(`/billing`, billingRoutes);
};

export default routes;
