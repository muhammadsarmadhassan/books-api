const express = require('express');
const userController = require('../controllers/userControllers');
const unAuthenticatedRouter = express.Router();

unAuthenticatedRouter.post("/register", userController.Registration);
unAuthenticatedRouter.get("/loginuser", userController.loginUser);
unAuthenticatedRouter.get('/verifyaccount/:email/:token', userController.verifyaccount);
//unAuthenticatedRouter.post("/publishbook", userController.publishBook);












module.exports = unAuthenticatedRouter;