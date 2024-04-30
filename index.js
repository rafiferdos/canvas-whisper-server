const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


require('dotenv').config()

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(cors())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.wnzpcgw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const dataCollection = client.db('dataDB').collection('data')

    app.get('/art_and_crafts', async (req, res) => {
        const cursor = dataCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.get('/myArtAndCrafts/:email', async (req, res) => {
      const result = await dataCollection.find({userEmail: req.params.email}).toArray();
      res.send(result);
    })

    app.get('/singleItem/:id', async (req, res) => {
      console.log(req.params.id)
      const result = await dataCollection.findOne({ _id: new ObjectId(req.params.id) });
      res.send(result);
    })

    // app.get('/art_and_crafts/:id', async (req, res) => {
    //   const result = await dataCollection.findOne({ _id: req.params.id });
    //   res.send(result);
    // })

    app.post('/art_and_crafts', async (req, res)=> {
        const newData = req.body;
        console.log(newData);
        const result = await dataCollection.insertOne(newData);
        res.send(result)
    })

    app.delete('/art_and_crafts/:id', async (req, res) => {
      const result = await dataCollection.deleteOne({ _id: new ObjectId(req.params.id) });
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})