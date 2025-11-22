import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ParkingSession } from './parking-session.schema';

export type AccessLogDocument = AccessLog & Document;

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class AccessLog {
    @Prop({ required: true })
    licensePlate: string;

    @Prop({ required: true, enum: ['entry', 'exit'] })
    action: string;

    @Prop({ required: true })
    timestamp: Date;

    @Prop()
    raspberryPiId: string;

    @Prop()
    image: string;

    @Prop({ required: true })
    isAuthorized: boolean;

    @Prop({ type: Types.ObjectId, ref: 'ParkingSession' })
    sessionId: ParkingSession;

    @Prop({ required: true, enum: ['allowed', 'denied', 'error', 'warning'] })
    responseStatus: string;

    @Prop()
    errorMessage: string;
}

export const AccessLogSchema = SchemaFactory.createForClass(AccessLog);

// Indexes
AccessLogSchema.index({ timestamp: -1 });
AccessLogSchema.index({ licensePlate: 1, timestamp: -1 });
