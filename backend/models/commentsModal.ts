import mongoose, { InferSchemaType } from "mongoose";

const replaysSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        maxlength: 150
    },
    replyingTo: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
}, { timestamps: true })

const commentSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    content: {
        type: String,
        required: true,
        maxlength: 150
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    feedbackId: {
        type: Number,
        required: true
    },
    replies: [replaysSchema]
}, { timestamps: true })

type comments = InferSchemaType<typeof commentSchema>

export default mongoose.model<comments>('comments', commentSchema)
