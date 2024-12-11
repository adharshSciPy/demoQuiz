import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import dotenv from 'dotenv'
import path from "path";
import { fileURLToPath } from "url";
import adminRouter from './routes/adminRouter.js'
import userRouter from './routes/userRouter.js';
import questionRouter from './routes/questionRouter.js';
import sectionRoute from './routes/sectionRoute.js';
import superAdminRouter from './routes/superAdminRouter.js';

dotenv.config()

const app = express()
dotenv.config({
    path: './env'
})

const _filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(_filename);

app.use(express.json())
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(cors())
app.use(cookieParser())

app.use('/api/v1/admin', adminRouter)
app.use('/api/v1/user', userRouter)
app.use('/api/v1/question', questionRouter)
app.use('/api/v1/section', sectionRoute)
app.use('/api/v1/superadmin', superAdminRouter)
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

export { app }