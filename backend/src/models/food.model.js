import {model, Schema} from 'mongoose';

export const FoodSchema = new Schema(
    {
        name: {type: String, required: true},
        price: {type: Number, required: true},
        tags: {type: [String]},
        favorite: {type: Boolean, default: true},
        stars: {type: Number, default: 5},
        imageUrl: {type: String, required: true},
        origins: {type: [String], required: true},
        waitTime: {type: String, required: true},
    },
    {
        toJSON: {
            virtuals: true,
        },
        toObject: {
            virtuals: true,
        },
    }
);

export const FoodModel = model('food', FoodSchema);