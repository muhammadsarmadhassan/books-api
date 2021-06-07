const jwt = require('jsonwebtoken');
const express = require('express');
const app = express();

app.use(express.json());
exports.authenticateToken = (req, res, next) => {
    //console.log("middleware called");
    const authHeader = req.headers['authorization']
    const token = authHeader;
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.TOKEN_SECRET, (err, admin) => {
        //console.log("User in middleware is", user)
        if (err) return res.sendStatus(403)
        req.admin = admin.user;
        next()
    })
}