import { Controller, Get } from '@nestjs/common';

@Controller('app')
export class AppController {
    @Get('healthcheck')
    healthCheck() {
        return { status: 'OK' };
    }
}
