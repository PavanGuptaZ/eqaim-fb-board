import bcrypt from 'bcrypt';
import UserModal from '../models/userModal'
import jwt, { JwtPayload, Secret, VerifyErrors } from 'jsonwebtoken';
import { RequestHandler } from 'express';


const register: RequestHandler = async (req, res, next) => {
    try {
        const { name, email, password, userName } = req.body
        if (!name || !email || !password || !userName) {
            return res.status(400).json({ message: "all Fields are Required" })
        }

        const isExistEmail = await UserModal.findOne({ email: email.toLowerCase() })
        if (isExistEmail) {
            return res.status(409).send({ status: 'error', message: email + " is Already Exist" })
        }

        const isExistUserName = await UserModal.findOne({ userName })
        if (isExistUserName) {
            return res.status(409).send({ status: 'error', message: userName + " is Already Exist" })
        }

        const hashPassword = await bcrypt.hash(password, 10)
        const newUser = new UserModal({ name, email, password: hashPassword, userName })
        const createdUser = await newUser.save()

        next()

    } catch (error: any) {
        console.log(error?.message)
        res.status(500).json({ status: 'error', message: "Some Thing wrong on Server" })
    }
}

const login: RequestHandler = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ message: "all Fields are Required" })
        }

        const isExist = await UserModal.findOne({ email: email.toLowerCase() }).lean()
        if (!isExist) {
            return res.status(409).send({ status: 'error', message: email + " is not Register" })
        }

        const passwordCheck = await bcrypt.compare(password, isExist.password)
        if (!passwordCheck) {
            return res.status(404).send({ status: 'error', message: "Check Your credentials, Password is Wrong" })
        }
        const refreshToken = jwt.sign({ email, _id: isExist._id }, process.env.REFRESH_TOKEN as string, { expiresIn: '1d' })
        const accessToken = jwt.sign({ email, _id: isExist._id }, process.env.ACCESS_TOKEN as string, { expiresIn: '1h' })
        res.cookie(`REFRESH_TOKEN`, refreshToken, {
            sameSite: false,
            maxAge: 1 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: true,
        })
        res.cookie(`ACCESS_TOKEN`, accessToken, {
            sameSite: false,
            maxAge: 1 * 24 * 60 * 1000,
            httpOnly: true,
            secure: true,
        })
        const { password: hidden, ...rem } = isExist
        // delete isExist.password
        res.json({ status: "success", user: { ...rem } })

    } catch (error: any) {
        console.log(error?.message)
        res.status(500).json({ status: 'error', message: "Some Thing wrong on Server" })
    }
}

const refresh: RequestHandler = async (req, res) => {
    try {
        // const { REFRESH_TOKEN } = req.cookies

        jwt.verify(req.cookies?.REFRESH_TOKEN, process.env.REFRESH_TOKEN as Secret, async (err: VerifyErrors | null, data: JwtPayload | string | undefined) => {
            if (err || typeof data === 'string') return res.status(403).send({ status: 'error', message: " fForbidden" })

            const user = await UserModal.findOne({ email: data?.email }).lean().exec()
            if (!user) {
                return res.status(409).send({ status: 'error', message: "user is not Register" })
            }
            const { password: hidden, ...rem } = user

            // delete user.password
            const accessToken = jwt.sign({ email: user.email }, process.env.ACCESS_TOKEN as string, { expiresIn: '1h' })
            res.cookie(`ACCESS_TOKEN`, accessToken, {
                sameSite: false,
                maxAge: 1 * 24 * 60 * 1000,
                httpOnly: true,
                secure: true,
            })
            res.status(200).json({ status: 'success', user: { ...rem } })
        })
    } catch (error: any) {
        console.log(error?.message)
        res.status(500).json({ message: "Some Thing wrong on Server" })
    }
}

const logout: RequestHandler = (req, res) => {
    const cookie = req.cookies

    // if (!cookie?.jwt) return res.status(204).json({ status: 'error', message: "Logout Successfully no code" })
    res.clearCookie('ACCESS_TOKEN', {
        httpOnly: true,
        sameSite: false,
        secure: true,
    })
    res.clearCookie('REFRESH_TOKEN', {
        httpOnly: true,
        sameSite: false,
        secure: true,
    })

    res.status(200).json({ status: 'success', message: "Logout Successfully" })
}

export { register, login, refresh, logout }