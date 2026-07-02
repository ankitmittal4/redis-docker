import express from "express"
import Redis from "ioredis"

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

function getOtpKey(phone) {
    return `otp:${phone}`
}

app.post('/otp/send', async (req, res) => {
    const { phone } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await redis.set(getOtpKey(phone), otp, 'EX', 30);
    res.json({ message: "Otp send successfully", otp })
})

app.post('/otp/verify', async (req, res) => {
    const { phone, otp } = req.body;
    const redisOtp = await redis.get(getOtpKey(phone))
    // console.log(redisOtp);
    if (!redisOtp) {
        return res.status(400).json({ message: "Otp exired or not found" })
    }
    if (otp !== redisOtp) {
        return res.status(400).json({ message: "Otp not matched" })
    }
    await redis.del(getOtpKey(phone));
    return res.json({ message: "Otp verified successfully" })
})

app.get('/otp/:phone/ttl', async (req, res) => {
    const phone = req.params.phone;
    const ttl = await redis.ttl(getOtpKey(phone));
    res.json({ ttl })
})

app.listen(3000, () => {
    console.log('Server running on PORT: 3000');
})
