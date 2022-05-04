const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { query } = require("express");
const jwt = require("jsonwebtoken");
const { send } = require("express/lib/response");
const app = express();

app.use(cors());
app.use(express.json());

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send({ message: "unauthorized access" });
    // return { message: "unauthorized access" };
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: "forbidden" });
    }
    console.log("decoded", decoded);
    req.decoded = decoded;
  });
  // console.log("inside verification", authHeader);
  next();
}

// const myToken = authHeader.split(" ")[1];
// function verifyToken(token) {
//   let email;
//   jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
//     if (err) {
//       email = "invalid email";
//     }
//     if (decoded) {
//       console.log(decoded);
//       email = decoded;
//     }
//   });
//   return email;
// }
// next();

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
    const carAdd = client.db("CarValley").collection("addCar");

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

    // get car item
    app.get("/addCar", verifyToken, async (req, res) => {
      // const authHeader = req.headers.authorization;
      // console.log(authHeader);
      const decodedEmail = req.decoded?.email;
      const email = req.query.email;
      console.log(email);

      if (email === decodedEmail) {
        const query = { email: email };
        const cursor = carAdd.find(query);
        const getItem = await cursor.toArray();
        res.send(getItem);
      } else {
        res.status(403).send({ message: "forbidden access" });
      }
    });
    // add new car
    app.post("/addCar", async (req, res) => {
      const add = req.body;
      const result = await carAdd.insertOne(add);
      res.send(result);
    });
    // app.get("/addCar", async (req, res) => {
    //   const getToken = req.headers.authorization;
    //   console.log(getToken);
    //   const [email, accessToken] = getToken.split(" ");
    //   const decoded = verifyToken(accessToken);

    //   if (email === decoded.email) {
    //     const addcar = await carAdd.find({ email: email }).toArray();
    //     res.send(addcar);
    //   } else {
    //     res.send({ success: "UnAuthorized assess" });
    //   }
    // });
    //
    app.post("/login", (req, res) => {
      const email = req.body;
      const token = jwt.sign(email, process.env.ACCESS_TOKEN);
      console.log(token);
      res.send({ token });
    });

    // app.post("/addCar", async (req, res) => {
    //   const newCar = req.body;
    //   const getToken = req.headers.authorization;
    //   const [email, accessToken] = getToken?.split(" ");
    //   var decoded = verifyToken(accessToken);
    //   // const decoded = verifyToken(accessToken, process.env.ACCESS_TOKEN);
    //   console.log(decoded);
    //   if (email === decoded.email) {
    //     const result = await carAdd.insertOne(newCar);
    //     res.send(result);
    //   } else {
    //     res.send({ success: "UnAuthorized assess" });
    //   }
    // });

    // delete
    app.delete("/Cars/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await carCollection.deleteOne(query);
      res.send(result);
    });
    app.delete("/addCar/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await carAdd.deleteOne(query);
      res.send(result);
    });
    //delete
    // app.delete("/Cars/:id", async (res, req) => {
    //   const id = req.params.id;
    //   const query = { _id: ObjectId(id) };
    //   const result = await carCollection.deleteOne(query);
    //   res.send(result);
    // });
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

// function verifyToken(token) {
//   let email;
//   jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
//     if (err) {
//       email = "invalid email";
//     }
//     if (decoded) {
//       console.log(decoded);
//       email = decoded;
//     }
//   });
//   return email;
// }
