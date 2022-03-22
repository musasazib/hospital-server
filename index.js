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
        const appointmentCollection = database.collection('appointments');
        const ordersCollection = database.collection('orders');




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

        app.get('/appointments', async (req, res) => {
            const email = req.query.email;                                    // ---------
            const date = new Date(req.query.date).toLocaleDateString();       // ----------
            const query = { email: email, date: date };                        // filter user
            // console.log(query);
            const cursor = appointmentCollection.find(query);
            const appointments = await cursor.toArray();
            res.json(appointments);
        })

        app.post('/appointments', async (req, res) => {
            const appointment = req.body;
            // console.log(appointment);
            // res.json({ message: 'hello' })
            const result = await appointmentCollection.insertOne(appointment);
            // console.log(result);
            res.json(result);
        });

        app.get("/myBooking/:email", async (req, res) => {
            const result = await ordersCollection.find({
                email: req.params.email,
            }).toArray();
            res.send(result);
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