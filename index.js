const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { query } = require("express");
const app = express();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kd59j.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const carCollection = client.db("CarValley").collection("Cars");
    const VehiclesCollection = client.db("CarValley").collection("Vehicles");

    //car Collection
    app.get("/Cars", async (req, res) => {
      const query = {};
      const cursor = carCollection.find(query);
      const car = await cursor.toArray();
      res.send(car);
    });

    //Vehicles Collection.
    app.get("/Vehicles", async (req, res) => {
      const query = {};
      const cursor = VehiclesCollection.find(query);
      const vehicle = await cursor.toArray();
      res.send(vehicle);
    });
    //
    app.get("/Cars/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const cars = await carCollection.findOne(query);
      res.send(cars);
    });
    //
    app.put("/Cars/:id", async (req, res) => {
      const id = req.params.id;
      const newCars = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateCar = {
        $set: {
          quantity: newCars.quantity,
        },
      };
      const result = await carCollection.updateOne(filter, updateCar, options);
      res.send(result);
    });
    app.post("/Cars", async (req, res) => {
      const newCar = req.body;
      const result = await carCollection.insertOne(newCar);
      res.send(result);
    });
    // delete
    app.delete("/Cars/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await carCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("server is running");
});

app.listen(port, () => {
  console.log("running", port);
});
