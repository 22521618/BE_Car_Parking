import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ResidentDocument = Resident & Document;

@Schema({ timestamps: true })
export class Resident {
    @Prop({ required: true })
    fullName: string;

    @Prop({ required: true })
    apartmentNumber: string;

    @Prop({ required: true })
    phoneNumber: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true, enum: ['active', 'inactive', 'suspended'], default: 'active' })
    status: string;
}

export const ResidentSchema = SchemaFactory.createForClass(Resident);
