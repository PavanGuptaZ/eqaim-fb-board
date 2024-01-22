import express from 'express';
import verifyJWT from '../middleware/verifyJWT'
import { postComments, postReplay } from '../controllers/commentsControllers';

const router = express.Router()

router.use(verifyJWT as any)

router.post('/:id', postComments)

router.post('/replay/:id', postReplay)


export default router