import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealthCheck() {
    return { statusCode: 200, message: 'server is alive' };
  }
}
