import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('1 - Public')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health-check')
  getHealthCheck() {
    return this.appService.getHealthCheck();
  }
}
