import express from "express"
import Redis from "ioredis"

const app = express();
app.use(express.json());

const publisher = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

app.post('/send-notification', async (req, res) => {
    const notification = {
        title: req.body.title,
        body: req.body.body,
        createAt: new Date().toISOString(),
    }
    const receivers = await publisher.publish('notifications', JSON.stringify(notification))
    res.json({ message: "Notification send successully", receivers })
})

app.get('/health', async (req, res) => {
    res.json({ message: "OK" })
})

app.listen(3000, () => {
    console.log('Server running on PORT: 3000');
})


