import express from "express"
import Redis from "ioredis"

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

const QUEUE_KEY = 'queue:email'

app.post('/add/queue', async (req, res) => {
    const emailData = {
        email: req.body.email,
        subject: req.body.subject,
        body: req.body.body,
        createdAt: new Date().toISOString(),
    }
    await redis.lpush(QUEUE_KEY, JSON.stringify(emailData));
    res.json({ message: "email added to queue", emailData })
})

app.get('/process', async (req, res) => {
    const rawData = await redis.rpop(QUEUE_KEY);
    // console.log(rawData);
    if (!rawData) {
        return res.json({ message: 'empty queue' })
    }
    const data = JSON.parse(rawData);
    res.json({ message: "Email processed", data })
})

app.get('/health', async (req, res) => {
    res.json({ message: "OK" })
})

app.listen(3000, () => {
    console.log('Server running on PORT: 3000');
})


