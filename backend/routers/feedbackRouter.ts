import express from 'express';
import verifyJWT from '../middleware/verifyJWT'
import { addFeedback, deleteFeedback, getFeedbackDetail, getFeedbackList, modifyFeedback } from '../controllers/feedbackControllers';

const router = express.Router()

router.use(verifyJWT as any)

router.get('/', getFeedbackList)

router.get('/detail/:id', getFeedbackDetail)

router.post('/add', addFeedback)

router.post('/modify/:id', modifyFeedback)

router.delete('/delete/:id', deleteFeedback)

export default router