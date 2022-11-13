import express from 'express';
import * as http from "http";

import appPackage from '../package.json';
import expressConfig from './config/expressConfig'; 
import 'dotenv/config';
import { SocketServer } from './socket';
// import './config/db_connection'; // uncomment for database connection


const port = process.env.PORT || 2000;
const app = express();

app.set('APP_PACKAGE', {
  name: appPackage.name,
  version: appPackage.version,
});

expressConfig(app);

const server = http.createServer(app);
new SocketServer(server);

server.listen(port, () => logger.info(`App listening on port ${port}...`));

export default app;
