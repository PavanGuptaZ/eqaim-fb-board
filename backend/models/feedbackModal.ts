import mongoose, { InferSchemaType } from "mongoose";

const feedbackSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 150
    },
    category: {
        type: String,
        enum: ['enhancement', 'bug', 'feature', 'ui', 'ux'],
        required: true,
    },
    upvotes: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['suggestion', 'planning', 'in-Progress', 'live'],
        required: true,
        default: 'suggestion'
    },
    description: {
        type: String,
        required: true,
        maxlength: 150
    },
    comments: {
        type: Number,
        required: true,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    deleted: {
        type: Boolean,
        default: false
    },
}, { timestamps: true })

type feedback = InferSchemaType<typeof feedbackSchema>

export default mongoose.model<feedback>('feedbacks', feedbackSchema)
