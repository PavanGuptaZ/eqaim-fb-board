import { Request, Response } from 'express';
import FeedbackModal from '../models/feedbackModal';
import CommentsModal from '../models/commentsModal';

interface AuthenticatedRequest extends Request {
    user?: object
}

export const getFeedbackList = async (req: AuthenticatedRequest, res: Response) => {
    try {
        let list = await FeedbackModal.find({ deleted: false }).lean()

        if (list.length < 1) return res.status(404).json({ status: "error", message: "No Feeback Found" })

        res.status(200).json({ status: "success", list })
    } catch (error: any) {
        console.log(error?.message)
        res.status(500).json({ status: "error", message: "something went try later" })
    }
}

export const getFeedbackDetail = async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.params.id) return res.status(404).json({ status: "error", message: "No id Found" })

        let feedbacks = await FeedbackModal.findOne({ id: Number(req.params.id), deleted: false }).lean()

        if (!feedbacks) return res.status(404).json({ status: "error", message: `No Feeback Found with this id ${req.params.id}` })

        let comments = await CommentsModal.find({ feedbackId: Number(req.params.id) }).lean().populate("user").populate("replies.user")

        res.status(200).json({ status: "success", feedbacks, comments })
    } catch (error: any) {
        console.log(error?.message)
        res.status(500).json({ status: "error", message: "something went try later" })
    }
}

export const addFeedback = async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!(req.user as { _id?: string })?._id) return res.status(404).json({ status: "error", message: "No id Found" })

        const { title, category, description } = req.body

        if (!title || !category || !description) {
            return res.status(400).json({ message: "all Fields are Required" })
        }

        let total = await FeedbackModal.find().countDocuments()

        let newFeedback = new FeedbackModal({ id: total + 1, title, category: category.toLowerCase(), description, user: (req.user as { _id?: string })?._id })

        let result = await newFeedback.save()

        res.status(200).json({ status: "success", result })

    } catch (error: any) {
        console.log(error?.message)
        res.status(500).json({ status: "error", message: error?.message || "something went try later" })
    }
}

export const modifyFeedback = async (req: AuthenticatedRequest, res: Response) => {
    console.log(req.params.id)
    if (!req.params.id) return res.status(404).json({ status: "error", message: "No id Found" })

    let feedback = await FeedbackModal.findOne({ id: req.params.id }).lean()

    if (feedback?.user != (req.user as { _id?: string })?._id) {
        return res.status(404).json({ status: "error", message: "you don't have access to delete feedback" })
    }

    let updatedFeedback = await FeedbackModal.findOneAndUpdate({ id: req.params.id }, { $set: { ...req.body } })

    res.status(200).json({ status: "success", result: updatedFeedback })
}

export const deleteFeedback = async (req: AuthenticatedRequest, res: Response) => {
    try {
        console.log(req.params.id)
        if (!req.params.id) return res.status(404).json({ status: "error", message: "No id Found" })

        let feedback = await FeedbackModal.findOne({ id: req.params.id }).lean()

        if (feedback?.user != (req.user as { _id?: string })?._id) {
            return res.status(404).json({ status: "error", message: "you don't have access to delete feedback" })
        }

        let deletedFeedback = await FeedbackModal.findOneAndUpdate({ id: req.params.id }, { $set: { deleted: true } })

        res.status(200).json({ status: "success", message: `${req.params.id} is deleted` })
    } catch (error: any) {
        console.log(error?.message)
        res.status(500).json({ status: "error", message: error?.message || "something went try later" })

    }
}
