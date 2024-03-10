const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require('mongodb');
const path = require('path');


// Logger middleware function
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next(); // Pass control to the next middleware function
});

// CORS middleware
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static('public'));

// const staticPath = path.resolve(__dirname, "static");
// app.use(express.static(staticPath));



let db;


MongoClient.connect('mongodb+srv://reia2004:reia1326@cluster0.ykxntib.mongodb.net/', (err, client) => {
    if (err) {
        console.error('Error connecting to MongoDB:', err);
        return;
    }
    console.log('Connected to MongoDB');
    db = client.db('spotshare');
});



app.get('/', (req, res) => {
    res.send('Select a collection, e.g., /collection/messages');
});

app.param('collectionName', (req, res, next, collectionName) => {
    req.collection = db.collection(collectionName);
    return next();
});

app.get('/collection/:collectionName', (req, res, next) => {
    req.collection.find({}).toArray((err, results) => {
        if (err) return next(err);
        res.send(results);
    });
});


// Handle form submission
app.post('/renterregistrations', (req, res) => {
    const { name, email, password, phone, gender, age, nationality, parkingSpaces } = req.body;

    // Insert the registration data into the renterregistrations collection
    db.collection('renterregistrations').insertOne({
        name,
        email,
        password,
        phone,
        gender,
        age,
        nationality,
        parkingSpaces,
    }, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error saving registration data');
        } else {
            console.log('Registration data saved successfully');
            // Redirect to the login page
            res.redirect('/login-renter.html'); // Assuming login-renter.html is the login page
        }
    });
});

app.get('/collection/:collectionName/:id', (req, res, next) => {
    req.collection.findOne({ _id: new ObjectId(req.params.id) }, (err, result) => {
        if (err) return next(err);
        res.send(result);
    });
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});