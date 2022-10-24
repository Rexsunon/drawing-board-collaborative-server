import status from 'http-status';
import { Response } from 'express';

export const info = (res: Response, message: String, code: number, data = []) => res.status(code).json({
  status: 'success',
  message,
  data,
});

export const error = (res: Response, message = '', code = 500) => res.status(code).json({
  status: 'error',
  message: message || status[`${code}_NAME`],
});
