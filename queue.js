const Queue = require('bull');
const queue = new Queue('myQueue');
queue.process(async(job) => {
    // Job processing logic goes here
    // ffmpeg -i "my-video.mkv" -af "highpass=f=200 lowpass=f=3000,afftdn=nf=-25" output-video.mk
    console.log(`Processing job with data: ${JSON.stringify(job.data)}`);
});
queue.add({ videoId: 1 });
queue.add({ videoId: 2 });
queue.on('completed', (job, result) => {
    console.log(`Job ${job.id} completed with result: ${result}`);
});
queue
    .on('error', (error) => {
        console.error('Queue error:', error);
    })
    .on('failed', (job, error) => {
        console.error(`Job ${job.id} failed:`, error);
    });
queue
    .isReady()
    .then(() => {
        console.log('Queue processing started.');
        queue.resume(); // Start processing jobs
    })
    .catch((error) => {
        console.error('Failed to start the queue:', error);
    });