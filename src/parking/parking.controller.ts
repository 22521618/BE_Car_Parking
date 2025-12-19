import { Controller, Logger, Inject } from '@nestjs/common';
import { MessagePattern, Payload, Ctx, MqttContext, ClientProxy } from '@nestjs/microservices';
import { ParkingService } from './parking.service';

@Controller()
export class ParkingController {
    private readonly logger = new Logger(ParkingController.name);

    constructor(
        private readonly parkingService: ParkingService,
        @Inject('MQTT_SERVICE') private client: ClientProxy,
    ) { }

    @MessagePattern('parking/scan')
    async handleScan(@Payload() data: any, @Ctx() context: MqttContext) {
        this.logger.log(`Received scan data: ${JSON.stringify(data)}`);
        // If data is string, parse it
        const payload = typeof data === 'string' ? JSON.parse(data) : data;
        const result = await this.parkingService.handleScan(payload);

        // Publish response back to MQTT
        this.client.emit('parking/response', result);
        this.logger.log(`Published response: ${JSON.stringify(result)}`);

        return result;
    }
}
