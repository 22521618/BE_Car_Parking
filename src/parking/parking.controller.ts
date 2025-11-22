import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload, Ctx, MqttContext } from '@nestjs/microservices';
import { ParkingService } from './parking.service';

@Controller()
export class ParkingController {
    private readonly logger = new Logger(ParkingController.name);

    constructor(private readonly parkingService: ParkingService) { }

    @MessagePattern('parking/scan')
    async handleScan(@Payload() data: any, @Ctx() context: MqttContext) {
        this.logger.log(`Received scan data: ${JSON.stringify(data)}`);
        // If data is string, parse it
        const payload = typeof data === 'string' ? JSON.parse(data) : data;
        return await this.parkingService.handleScan(payload);
    }
}
