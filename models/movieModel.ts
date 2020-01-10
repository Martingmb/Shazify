import { Schema, model } from "mongoose";

const MovieSchema = new Schema({
    title: {
        type: String, 
        required: true
    },
    description: {
        type: String, 
        required: false
    },
    duration: {
        type: Number, 
        required: true
    },
    imageURL: {
        type: String,
        required: false
    }
});

export default model('Movie', MovieSchema);