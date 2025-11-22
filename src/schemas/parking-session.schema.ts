import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Vehicle } from './vehicle.schema';
import { Resident } from './resident.schema';

export type ParkingSessionDocument = ParkingSession & Document;

@Schema({ timestamps: true })
export class ParkingSession {
    @Prop({ required: true, index: true })
    licensePlate: string;

    @Prop({ type: Types.ObjectId, ref: 'Vehicle', required: true })
    vehicleId: Vehicle;

    @Prop({ type: Types.ObjectId, ref: 'Resident', required: true })
    residentId: Resident;

    @Prop({ required: true })
    entryTime: Date;

    @Prop({ default: null })
    exitTime: Date;

    @Prop()
    entryImage: string;

    @Prop()
    exitImage: string;

    @Prop({ default: 0 })
    duration: number;

    @Prop({ enum: ['in_parking', 'completed'], default: 'in_parking' })
    status: string;
}

export const ParkingSessionSchema = SchemaFactory.createForClass(ParkingSession);

// Indexes
ParkingSessionSchema.index({ vehicleId: 1, status: 1 });
ParkingSessionSchema.index({ status: 1, exitTime: 1 });
