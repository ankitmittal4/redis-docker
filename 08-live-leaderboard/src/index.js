import express from "express"
import Redis from "ioredis"

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')
await redis.set('user:123', 10);

app.post('/post/:id/view', async (req, res) => {
    const userId = req.params.id;
    const result = await redis.incr(`user:${userId}`)
    res.json({ message: "User view inc", result })
})

app.post('/leaderboard/add', async (req, res) => {
    const data = await redis.zadd('leaderboard', req.body.score, `user:${req.body.id}`,);
    res.json({ message: "user added successfully", data })
})

app.post('/leaderboard/score', async (req, res) => {
    const data = await redis.zincrby('leaderboard', req.body.score, `user:${req.body.id}`,);
    res.json({ message: "Score inc successfully", data })
})

app.get('/leaderboard', async (req, res) => {
    const data = await redis.zrevrange('leaderboard', 0, 10, 'WITHSCORES',);
    res.json({ message: "Leaderboard fetched successfully", data })
})

app.get('/leaderboard/:userid/score', async (req, res) => {
    const userId = req.params.userid;
    const score = await redis.zrevrank('leaderboard', `user:${userId}`);
    res.json({ message: "Score fetched successfully", score })
})

app.listen(3000, () => {
    console.log('Server running on PORT: 3000');
})
