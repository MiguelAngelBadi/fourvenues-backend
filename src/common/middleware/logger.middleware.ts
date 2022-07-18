import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  logger: Logger;
  constructor() {
    this.logger = new Logger('LoggerMiddleware');
  }
  use(req: Request, res: Response, next: NextFunction) {
    this.logger.log(
      `[Request] url: ${req.baseUrl + req.url}, method: ${req.method}, body: ${req.body}`
    );
    next();
  }
}
