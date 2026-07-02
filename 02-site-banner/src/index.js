import express from "express"
import Redis from "ioredis"

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

const BANNER_KEY = 'app:banner';

app.post('/banner', async (req, res) => {
    // console.log('res body: ', req);
    const setBanner = await redis.set(BANNER_KEY, req.body.message || 'Default Message')
    res.json({ success: true, message: setBanner })
})

app.get('/banner', async (req, res) => {
    const getBanner = await redis.get(BANNER_KEY)
    if (getBanner) {
        res.json({ success: true, message: getBanner })
    }
    res.json({ success: false, message: "Banner not exists" })
})

app.get('/banner/exists', async (req, res) => {
    const getBanner = await redis.exists(BANNER_KEY)
    console.log("get banner: ", getBanner);
    res.json({ success: true, message: !!getBanner })
})

app.delete('/banner', async (req, res) => {
    const getBanner = await redis.del(BANNER_KEY)

    res.json({ success: true, message: getBanner })
})

app.listen(3000, () => {
    console.log('Server running on PORT: 3000');
})
