export class CreateVehicleDto {
    licensePlate: string;
    cardId: string;
    residentId: string;
    vehicleType: 'car' | 'motorbike';
    brand?: string;
    color?: string;
    status?: 'active' | 'inactive';
}

