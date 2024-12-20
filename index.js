const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 7000;

// middle ware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jjtu4en.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const coffeeCollection = client.db("coffeeDB").collection("coffee");

    // app.get() --> Read Operation
    app.get("/coffee", async (req, res) => {
      const result = await coffeeCollection.find().toArray();
      res.send(result);
    });

    app.get("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.findOne(query);
      res.send(result);
    });

    // app.post()
    app.post("/coffee", async (req, res) => {
      const newCoffee = req.body;
      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result);
    });

    // app.put()
    app.put("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const updatedCoffeeClient = req.body;
      const options = { upsert: true };

      const filter = { _id: new ObjectId(id) };
      const updatedCoffeeServer = {
        $set: {
          name: updatedCoffeeClient.name,
          quantity: updatedCoffeeClient.quantity,
          supplier: updatedCoffeeClient.supplier,
          taste: updatedCoffeeClient.taste,
          category: updatedCoffeeClient.category,
          details: updatedCoffeeClient.details,
          photo: updatedCoffeeClient.photo,
        },
      };
      const result = await coffeeCollection.updateOne(
        filter,
        updatedCoffeeServer,
        options
      );
      res.send(result);
    });

    // app.delete()
    app.delete("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("COFFEE STORE SERVER is running");
});

app.listen(port, () => {
  console.log(`COFFEE STORE SERVER is running on port: ${port}`);
});
