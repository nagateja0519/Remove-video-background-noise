const mongoose = require('mongoose');
const uri = "mongodb://0.0.0.0:27017/Video";

async function connect() {
    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.log(err);
    }
}
connect();

const linkschema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    link: {
        type: String,
    },
    status: {
        type: BigInt,
        required: true,
    },
    output: {
        type: String,
    }
})

const collection = mongoose.model("noise", linkschema)

module.exports = collection