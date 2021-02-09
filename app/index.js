// Modules
const express = require('express');
const mongoose = require('mongoose');

// express options
const app = express();
app.use(express.json());
app.use('/', require('./src/routes/myRoute.js'));
const hostname = '127.0.0.1'
const PORT = 3000

// mongoose.connect('mongodb://user@password')
mongoose.connect(
  "mongodb://tonnytg:teste@mongodb-service:27017", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

const Product = mongoose.model('Message')
Product.create({
  user: "Guest",
  message: "Hello World!",
  createAt: new Date()
});

// Express Listen
app.listen(PORT, () => {
  console.log('Listening at ' + PORT );
});