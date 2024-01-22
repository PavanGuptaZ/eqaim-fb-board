import mongoose, { InferSchemaType } from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 30,
    },
    userName: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 20,
        unique: true,
        lowercase: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: '/user-images/image-elijah.jpg'
    },
    quotes: [Object]
}, { timestamps: true })

type user = InferSchemaType<typeof userSchema>

export default mongoose.model<user>('user', userSchema)

