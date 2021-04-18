const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
const  ObjectID  = require('mongodb').ObjectId;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.38p2l.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express()

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('service'));
app.use(fileUpload());

const port = 5000;

app.get('/', (req, res) => {
    res.send("hello from db it's working working")
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const serviceCollection = client.db("wedding").collection("service");
    const reviewCollection = client.db("wedding").collection("review");
    const bookingCollection = client.db("wedding").collection("booking");
    const adminCollection = client.db("wedding").collection("admin");


    app.post('/addService', (req, res) => {
        const file = req.files.image;
        const name = req.body.name;
        const details = req.body.details;
        console.log("hello",file,name,details);
       const newImg = file.data;
        const encImg = newImg.toString('base64');

        var image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        };

        serviceCollection.insertOne({ name, details, image })
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    app.get('/getService', (req, res) => {
        serviceCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    });

    app.post('/addReview', (req, res) => {
        const file = req.files.image;
        const name = req.body.name;
        const title = req.body.title;
        const details = req.body.details;

       const newImg = file.data;
        const encImg = newImg.toString('base64');

        var image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        };

        reviewCollection.insertOne({ name, details, image, title })
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    app.get('/getReview', (req, res) => {
        reviewCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    });

    app.post('/addBooking', (req, res) => {
        const appointment = req.body;
        
        bookingCollection.insertOne(appointment)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    });

    app.post('/isAdmin', (req, res) => {
        const email = req.body;
        
        adminCollection.insertOne(email)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    });

    app.get('/admin', (req, res) => {
        adminCollection.find({email: req.query.email})
            .toArray((err, documents) => {
                res.send(documents);
            })
    });

    app.get('/services', (req, res) => {
        serviceCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    });

    app.get('/getBooking', (req, res) => {
        bookingCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    });

    app.delete('/delete/:id', (req, res) => {
        const id = ObjectID(req.params.id);
        serviceCollection.deleteOne({_id: id})
        .then(result =>{
          console.log("delete");
        })
      })

});



app.listen(process.env.PORT || port)