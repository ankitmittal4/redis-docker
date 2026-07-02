import express from "express"
import Redis from "ioredis"

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

function getOtpKey(phone) {
    return `otp:${phone}`
}

app.post('/user/:id/hash', async (req, res) => {
    const userId = req.params.id;
    await redis.hset(`user:${userId}:hash`, req.body);
    res.json({ message: "Hash set successfully" })
})

app.get('/user/:id/hash', async (req, res) => {
    const userId = req.params.id;
    const data = await redis.hgetall(`user:${userId}:hash`);
    res.json({ message: "Hash get successfully", data })
})

app.listen(3000, () => {
    console.log('Server running on PORT: 3000');
})
