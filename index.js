const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");
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
