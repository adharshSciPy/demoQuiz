import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'

import adminRouter from './routes/adminRouter.js'




const app = express()
dotenv.config({
    path: './env'
})


app.use(express.json())
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }))

app.use('/api/v1/admin', adminRouter)

export { app }