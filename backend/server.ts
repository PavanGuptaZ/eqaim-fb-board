import express, { request } from "express";
const app = express();
import mongoose from "mongoose";

import cors from 'cors';
import cookieParser from "cookie-parser";
import allowedOrigins from "./config/allowedOrigins";
import { logEvents, logger } from "./middleware/logger";
import errorHandler from "./middleware/errorHandler";
import connectDb from "./config/dbConnection";
import path from "path";


app.use(express.static('public'))
app.use(cors({
  origin: (origin, callBack) => {
    if (allowedOrigins.indexOf(origin as string) !== -1 || !origin) {
      callBack(null, true)
    } else {
      callBack(new Error('Not Allowed By CORS'), false)
    }
  },
  credentials: true,
  optionsSuccessStatus: 202
}))

connectDb()

app.use(logger)
app.use(express.json())
app.use(cookieParser())

import HomeRouter from './routers/homeRouter';
import AuthRouter from './routers/authRouter';
import FeedbackRouter from './routers/feedbackRouter';
import CommentsRouter from './routers/commentsRouter';

app.use('/', HomeRouter)
app.use('/auth', AuthRouter)
app.use('/feedback', FeedbackRouter)
app.use('/comment', CommentsRouter)


app.all('*', (req, res) => {
  res.status(404)
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, '..', 'views/404.html'))
  } else if (req.accepts('json')) {
    res.json({ message: '404 Not Found' })
  } else {
    res.type('text').send('404 Not Found')
  }
})

app.use(errorHandler)


mongoose.connection.once('open', () => {
  console.log("Backed Connected")

  app.listen(8000, () => {
    console.log("API is started");
  });
})

mongoose.connection.on('error', (err) => {
  console.log(err)
  logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})