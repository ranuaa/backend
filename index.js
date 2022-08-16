import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import AuthRoute from './Routes/AutthRoute.js'
import UserController from './Routes/UserRoute.js'
import PostsRoute from './Routes/PostsRoute.js'



const app = express();

app.use(cors())
app.use(bodyParser.json({limit: '30mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '30mb', extended: true}))

dotenv.config();

mongoose.connect(process.env.MONGO_DB)
.then(() => app.listen(process.env.PORT, () => console.log(`Server Running on port http://localhost:${process.env.PORT}`)))
.catch((err) => console.log(err))


app.use('/auth', AuthRoute)
app.use('/users', UserController)
app.use('/post', PostsRoute)