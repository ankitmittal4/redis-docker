import express from "express"
import Redis from "ioredis"
import { connection, emailQueue } from "./queue.js";

const app = express();
app.use(express.json());

app.post('/welcome-email', async (req, res) => {
    const job = await emailQueue.add(
        'send-welcome-email',
        {
            to: req.body.to,
            name: req.body.name,
        },
        {
            attempts: 3,
            backoff: {
                type: 'exponental',
                delay: 1000
            }
        }
    )
    res.json({ message: "welcome email added to queue", job })
})

app.get('/health', async (req, res) => {
    res.json({ message: "OK" })
})

app.listen(3000, () => {
    console.log('Server running on PORT: 3000');
})


