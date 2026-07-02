import { Worker } from 'bullmq'
import { connection } from './queue.js'

const worker = new Worker(
    'email',
    async (job) => {
        console.log('Processing new job: ', job.id, job.name, job.data);
        await new Promise((resolve) => setTimeout(resolve, 5000));
        console.log('job processed', job.id, job.name, job.data);
    },
    { connection }
)

worker.on('completed', (job) => {
    console.log('job completed', job.id, job.name, job.data);
})

worker.on('failed', (job, err) => {
    console.log('job failed', job.id, job.name, job.data, err);
})