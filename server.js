const express = require('express');
const collection = require('./mongo');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require("uuid");
const Queue = require('bull');
const queue = new Queue('myQueue');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

app.get("/", cors(), (req, res) => {
    res.send("hello")
})
app.post("/", (req, res) => {
    const { link } = req.body;
    console.log(link)
    const id = uuidv4();
    async function createData() {
        try {
            const data = {
                id: id,
                link: link,
                status: 0,
                output: link
            };
            const result = await collection.create(data);
            console.log('Data created successfully:', result);
        } catch (error) {
            console.error('Error creating data:', error);
        }
    }

    createData();
    queue.process(async(job) => {
        // Job processing logic goes here
        // ffmpeg -i "my-video.mkv" -af "highpass=f=200 lowpass=f=3000,afftdn=nf=-25" output-video.mk
        console.log(`Processing job with data: ${JSON.stringify(job.data)}`);
    });
    queue.add({ id });
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
})
app.listen(8000, () => {
    console.log('server is running on port 8000');
})