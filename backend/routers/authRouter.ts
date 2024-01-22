import express, { NextFunction, Request, Response, } from 'express';
import { register, login, refresh, logout } from '../controllers/authControllers'
import loginLimiter from '../middleware/loginLimiter'
import verifyJWT from '../middleware/verifyJWT'
import AuthenticatedRequest from '../interfaces/request';

const router = express.Router()


router.post('/register', loginLimiter, register, login)

router.post('/login', loginLimiter, login)

router.get('/refresh', refresh)

router.post('/logout', logout)

// router.post('/update/:role', verifyJWT as any, updatedata)

export default router