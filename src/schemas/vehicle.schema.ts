import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Resident } from './resident.schema';

export type VehicleDocument = Vehicle & Document;

@Schema({ timestamps: true })
export class Vehicle {
    @Prop({ required: true, unique: true, index: true })
    licensePlate: string;

    @Prop({ required: true, index: true })
    cardId: string;

    @Prop({ type: Types.ObjectId, ref: 'Resident', required: true })
    residentId: Resident;

    @Prop({ required: true, enum: ['car', 'motorbike'] })
    vehicleType: string;

    @Prop()
    brand: string;

    @Prop()
    color: string;

    @Prop({ enum: ['active', 'inactive'], default: 'active' })
    status: string;

    @Prop({ default: Date.now })
    registeredAt: Date;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);

// Create compound unique index for licensePlate + cardId
VehicleSchema.index({ licensePlate: 1, cardId: 1 }, { unique: true });
