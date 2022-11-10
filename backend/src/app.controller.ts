import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/')
  async greet() {
    return 'Heellllooooo';
  }

  @Get('/status')
  async statusCheck() {
    return '<h1>ALL GOODS! 🚀</h1>';
  }
}
