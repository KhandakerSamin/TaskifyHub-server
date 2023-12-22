const express = require('express');
const cors = require('cors');
require("dotenv").config()
const port = process.env.PORT || 5000;
const app = express()

// middleware
app.use(cors());
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vheow1k.mongodb.net/?retryWrites=true&w=majority`;

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


    const taskCollection = client.db('TaskifyHubDB').collection('tasks');

    app.post('/tasks', async (req, res) => {
      const newTask = req.body;
      const result = await taskCollection.insertOne(newTask);
      res.send(result);
    })

    app.get('/tasks' , async(req, res) => {
      const result = await taskCollection.find().toArray();
      res.json(result);
    })

    app.delete('/tasks/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await taskCollection.deleteOne(query);
      res.send(result);
  });

  app.patch('/tasks/:id', async (req, res) => {
    const item = req.body;
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) }
    const updatedDoc = {
        $set: {
            title: item.title,
            description: item.description,
            deadline: item.deadline,
            priority: item.priority
        }
    }
    const result = await taskCollection.updateOne(filter, updatedDoc)
    res.send(result);
})


  




    // app.get('/tasks', async (req, res) => {
    //   const { userEmail, type } = req.query;
    //   console.log(' userEmail:', userEmail, 'type:', type);
    
    //   try {
    //     const query = {
    //       userEmail: { $eq: userEmail },
    //       type: { $eq: type }
    //     };
    
    //     const result = await taskCollection.find(query).toArray();
    //     res.json(result);
    //   } catch (error) {
    //     console.error('Error fetching tasks:', error);
    //     res.status(500).json({ error: 'Internal Server Error' });
    //   }
    // });
    




    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('taskify is sitting')
})

app.listen(port, () => {
  console.log(`taskify is sitting on port ${port}`);
})