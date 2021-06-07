const multer = require('multer');
const datauri = require('datauri');
const path = require('path');


const storage = multer.memoryStorage();
console.log('multerCalled');
const multerUploads = multer({ storage }).single('image');

//const dUri = new datauri();

const dataUri = req => dUri.format(path.extname(req.file.originalname).toString(), req.file.buffer);

//export { multerUploads };
module.exports = multerUploads, dataUri;