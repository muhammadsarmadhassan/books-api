const express = require('express');
const mongoose = require('mongoose');
const mongodb = require('mongodb');
const app = express();
const unAuthenticatedRoutes = require('./routes/unauthenticated');
const authenticatedRoutes = require('./routes/authenticated');
const authenticateToken = require("./middlewares/jsonwebtoken");
app.use(express.json());

app.use('/api', authenticateToken.authenticateToken, authenticatedRoutes);
app.use('/', unAuthenticatedRoutes);

mongoose.connect("mongodb://localhost:27017/books-api", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
    console.log("Connected with DB!!!");
});

app.listen(3001, () => {
    console.log('App is listening on port 3001');
})

