import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Resident } from './schemas/resident.schema';
import { Vehicle } from './schemas/vehicle.schema';
import { Model } from 'mongoose';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);

    const residentModel = app.get<Model<Resident>>(getModelToken(Resident.name));
    const vehicleModel = app.get<Model<Vehicle>>(getModelToken(Vehicle.name));

    try {
        // Clear existing data
        await residentModel.deleteMany({});
        await vehicleModel.deleteMany({});
        console.log('Data cleared');
        

        // Create Residents
        const residents = await residentModel.create([
            {
                fullName: 'Nguyen Van A',
                apartmentNumber: 'A1-1001',
                phoneNumber: '0901234567',
                email: 'nguyenvana@example.com',
                status: 'active'
            },
            {
                fullName: 'Tran Thi B',
                apartmentNumber: 'B2-2002',
                phoneNumber: '0909876543',
                email: 'tranthib@example.com',
                status: 'active'
            },
            {
                fullName: 'Le Van C',
                apartmentNumber: 'C3-3003',
                phoneNumber: '0912345678',
                email: 'levanc@example.com',
                status: 'active'
            }
        ]);
        console.log(`Created ${residents.length} residents`);

        // Create Vehicles
        const vehicles = await vehicleModel.create([
            {
                licensePlate: '30A-12345',
                residentId: residents[0]._id,
                vehicleType: 'car',
                brand: 'Toyota',
                color: 'Black',
                status: 'active'
            },
            {
                licensePlate: '29B-67890',
                residentId: residents[1]._id,
                vehicleType: 'motorbike',
                brand: 'Honda',
                color: 'Red',
                status: 'active'
            },
            {
                licensePlate: '30E-55555',
                residentId: residents[2]._id,
                vehicleType: 'car',
                brand: 'Mazda',
                color: 'White',
                status: 'active'
            },
            {
                licensePlate: '29M-11111',
                residentId: residents[2]._id,
                vehicleType: 'motorbike',
                brand: 'Yamaha',
                color: 'Blue',
                status: 'active'
            }
        ]);
        console.log(`Created ${vehicles.length} vehicles`);

        console.log('Seeding completed');
    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        await app.close();
    }
}
bootstrap();
