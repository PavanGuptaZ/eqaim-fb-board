import { Request, Response } from 'express';
import FeedbackModal from '../models/feedbackModal';
import CommentsModal from '../models/commentsModal';

interface AuthenticatedRequest extends Request {
    user?: object
}

export const postComments = async (req: AuthenticatedRequest, res: Response) => {
    try {
        let { content } = req.body;

        if (!req.params.id) return res.status(404).json({ status: "error", message: "No id Found" })

        let feedbacks = await FeedbackModal.findOne({ id: Number(req.params.id), deleted: false }).lean()

        if (!feedbacks) return res.status(404).json({ status: "error", message: "No Feeback Found" })

        let total = await CommentsModal.find().countDocuments()

        let newComment = new CommentsModal({ id: total + 1, content, feedbackId: req.params.id, user: (req.user as { _id?: string })?._id })

        let result = await newComment.save()

        let updateFeedBack = await FeedbackModal.updateOne({ id: Number(req.params.id), deleted: false }, { $inc: { comments: 1 } })

        res.status(200).json({ status: "success", result })
    } catch (error: any) {
        console.log(error?.message)
        res.status(500).json({ status: "error", message: "something went try later" })
    }
}

export const postReplay = async (req: AuthenticatedRequest, res: Response) => {
    try {
        let { content, replyingTo } = req.body;

        if (!req.params.id) return res.status(404).json({ status: "error", message: "No id Found" })

        let comment = await CommentsModal.findOne({ id: Number(req.params.id) }).lean()

        if (!comment) return res.status(404).json({ status: "error", message: "No comment Found" })

        let total = await CommentsModal.find().countDocuments()

        let newReplay = { content, replyingTo, user: (req.user as { _id?: string })?._id }

        let result = await CommentsModal.findOneAndUpdate({ id: Number(req.params.id) }, { $addToSet: { replies: newReplay } })

        let updateFeedBack = await FeedbackModal.updateOne({ id: comment.feedbackId, deleted: false }, { $inc: { comments: 1 } })

        res.status(200).json({ status: "success", result })
    } catch (error: any) {
        console.log(error?.message)
        res.status(500).json({ status: "error", message: "something went try later" })
    }
}
