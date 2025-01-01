import dotenv from "dotenv"
import mongoose from "mongoose"
import express from "express"
import cors from "cors"
import ServerInfo from "./ServerInfoSchema.js"
import bodyParser from "body-parser"

const app = express()
const port = 8080

app.use(cors())
app.use(bodyParser.json())
dotenv.config({ path: './backend/.env' })

const conn = mongoose.connect(process.env.DB_URI, {
    serverSelectionTimeoutMS: 30000, // 30 seconds
    socketTimeoutMS: 45000, // 45 seconds
}).then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

app.get('/serverInfo', async (req, res) => {
    let data = await ServerInfo.findOne({})
    res.json(data)
})

app.put('/serverInfo', async (req, res) => {
    try {
        let update = {}
        update[req.body.attribute] = req.body.value
        await ServerInfo.findOneAndUpdate({}, update)
        res.status(200).send('Update successful');
    } catch {(e => {
        console.log('error while updating data: '+ e)
        res.status(500).json({ error: 'Internal Server Error' });
    })}
})

app.listen(port, () => {
    console.log(`App is running at port ${port}`)
})