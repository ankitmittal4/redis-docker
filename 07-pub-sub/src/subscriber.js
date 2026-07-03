import Redis from 'ioredis'

const subscriber1 = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')
const subscriber2 = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

subscriber1.subscribe('notifications', err => {
    if (err) {
        console.log('Failed to subscribe', err.message);
        return;
    }
    console.log("subscribed successfully - 1");
})

subscriber2.subscribe('notifications', err => {
    if (err) {
        console.log('Failed to subscribe', err.message);
        return;
    }
    console.log("subscribed successfully - 2");
})

subscriber1.on('message', (channel, message) => {
    console.log("1-Received on ", channel, " : ", message);
})

subscriber2.on('message', (channel, message) => {
    console.log("2-Received on ", channel, " : ", message);
})