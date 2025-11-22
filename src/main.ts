import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.MQTT,
    options: {
      url: process.env.MQTT_BROKER_URL || 'mqtt://broker.hivemq.com',
    },
  });

  await app.startAllMicroservices();
  await app.listen(3000);
  console.log('Parking Management Server (NestJS) Started');
}
bootstrap();
