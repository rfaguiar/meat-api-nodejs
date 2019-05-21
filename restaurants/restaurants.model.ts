import * as mongoose from 'mongoose';

export interface MenuItem extends mongoose.Document {
    name: string,
    prince: number
}

export interface Restaurant extends mongoose.Document {
    name: string,
    menu: MenuItem[]
}

const menuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    prince: {
        type: Number,
        required: true
    }
});

const restSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    menu: {
        type: [menuSchema],
        required: false,
        select: false,
        default: []
    }
});

export const Restaurant = mongoose.model<Restaurant>('Restaurant', restSchema);