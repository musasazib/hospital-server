const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;

const port = process.env.PORT || 8000;

// Middleware
const app = express();
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iyv3j.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();

        const database = client.db('hospital');
        const servicesCollection = database.collection('services');
        const doctorsCollection = database.collection('doctors');


        // Get services API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const service = await cursor.toArray();
            res.send(service);
        });

        // Get Doctors API
        app.get('/doctors', async (req, res) => {
            const cursor = doctorsCollection.find({});
            const doctor = await cursor.toArray();
            res.send(doctor);
        });

    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello Hospital System')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})