import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import dotenv from 'dotenv'

import adminRouter from './routes/adminRouter.js'
import userRouter from './routes/userRouter.js';

dotenv.config()

const app = express()
dotenv.config({
    path: './env'
})


app.use(express.json())
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }))
app.use(cookieParser())

app.use('/api/v1/admin', adminRouter)
app.use('/api/v1/user', userRouter)

export { app }