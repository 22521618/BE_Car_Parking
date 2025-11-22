require('dotenv').config();
const mongoose = require('mongoose');
const Resident = require('./models/Resident');
const Vehicle = require('./models/Vehicle');
const connectDB = require('./config/database');

const seedData = async () => {
    await connectDB();

    try {
        // Clear existing data
        await Resident.deleteMany({});
        await Vehicle.deleteMany({});

        console.log('Data cleared');

        // Create Resident
        const resident = await Resident.create({
            fullName: 'Nguyen Van A',
            apartmentNumber: 'A1-1001',
            phoneNumber: '0901234567',
            email: 'nguyenvana@example.com',
            status: 'active'
        });

        console.log('Resident created:', resident.fullName);

        // Create Vehicle
        const vehicle = await Vehicle.create({
            licensePlate: '30A-12345',
            residentId: resident._id,
            vehicleType: 'car',
            brand: 'Toyota',
            color: 'Black',
            status: 'active'
        });

        console.log('Vehicle created:', vehicle.licensePlate);

        console.log('Seeding completed');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
