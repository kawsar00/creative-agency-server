const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ggbl3.mongodb.net/<dbname>?retryWrites=true&w=majority`;

// console.log(process.env.DB_USER, process.env.DB_PASS, process.env.DB_NAME);
const app = express()
app.use(cors())
app.use(bodyParser.json())
// app.use(express.static('doctors'));
app.use(fileUpload());

app.get('/', (req, res) => {
  res.send('Hello its working!')
})

const port = 5000
app.listen(process.env.PORT || port)





const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const serviceCollection = client.db("creativeAgency").collection("services");
  const adminCollection = client.db("creativeAgency").collection("admins");
  const reviewCollection = client.db("creativeAgency").collection("reviews");
  const orderCollection = client.db("creativeAgency").collection("orderedService");

  app.post('/addOrder', (req, res) => {
    const order = req.body
    console.log(order);
    orderCollection.insertOne(order)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })
  
  app.get('/orders', (req, res) => {
    orderCollection.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
  });

  app.post('/addReview', (req, res) => {
    const review = req.body
    console.log(review);
    reviewCollection.insertOne(review)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

  app.get('/reviews', (req, res) => {
    reviewCollection.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
  });

  app.post('/addService', (req, res) => {
    const file = req.files.file;
    const title = req.body.title;
    const description = req.body.description;
    console.log(file, title, description);
    const newImg = file.data;
    const encImg = newImg.toString('base64');

    var image = {
      contentType: file.mimetype,
      size: file.size,
      img: Buffer.from(encImg, 'base64')
    };

    serviceCollection.insertOne({ title, description, image })
      .then(result => {
        res.send(result.insertedCount > 0);
      })
  })

  app.get('/services', (req, res) => {
    serviceCollection.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
  });


  app.post('/addAdmin', (req, res) => {
    const admin = req.body
    console.log(admin);
    adminCollection.insertOne(admin)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

  app.post('/isAdmin', (req, res) => {
    const email = req.body.email;
    adminCollection.find({ email: email })
      .toArray((err, admins) => {
        res.send(admins.length > 0);
      })
  })


});
