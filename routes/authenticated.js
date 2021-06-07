const express = require('express');
const userController = require('../controllers/userControllers');
const authenticatedRouter = express.Router();
const path = require('path');
// const multerUploads = require('../middlewares/multer');


var multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(__dirname + '/../uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 2,
    },
});


authenticatedRouter.post("/publishbook", userController.publishBook);
authenticatedRouter.put("/assignRole", userController.assignRole);
authenticatedRouter.get("/getAllBooks", userController.getAllBooks);
authenticatedRouter.put("/updateBook/:Id", userController.updateBooks);
authenticatedRouter.post("/buyBooks", userController.buyBooks);
authenticatedRouter.post("/uploadImage", multer({ storage: storage }).single('image'), userController.uploadImage);


module.exports = authenticatedRouter;



