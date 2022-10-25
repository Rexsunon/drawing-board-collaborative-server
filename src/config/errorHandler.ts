import 'dotenv/config';
import { Request, Response as ExpressResponse } from 'express';
import { Response } from '../utils/index';

export default function errorHandler ( error: any, _req: Request, res: ExpressResponse ) {
    let code = error.statusCode ? error.statusCode : 500;
    let message = "Ops!. Something went south :(";
    
    logger.error(error.message);

    if(process.env.NODE_ENV !== 'production') return Response.error(res, error.message, code);
    return Response.error(res, message, code);
};
