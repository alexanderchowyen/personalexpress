const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient


var db, collection;

const url = "mongodb+srv://devchow:devchow@cluster0.julzg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const dbName = "coffee";

app.listen(3000, () => {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(dbName);
        console.log("Connected to `" + dbName + "`!");
    });
});
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))



app.get('/', (req, res) => {
  db.collection('shops').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {shops: result})
  })
})

app.post('/postToCollection', (req, res) => {
  db.collection('shops').insertOne({name: req.body.name, image: req.body.image, votes: 0}, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

app.delete('/deleteFromCollection', (req, res) => {
  db.collection('shops').findOneAndDelete({name: req.body.name}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('shop deleted!')
  })
})

//add conditional or change method in db collection
// mongodb+srv://devchow:<password>@cluster0.julzg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority