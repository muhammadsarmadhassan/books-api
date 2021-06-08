const admin = require("../models/adminModel");
const books = require("../models/booksModel");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const express = require("express");
const app = express();
const cloudinary = require("cloudinary").v2;
const fileupload = require("express-fileupload");
const { error } = require("console");

app.use(fileupload({ useTempFiles: true }));

// body parser configuration

dotenv.config();
process.env.TOKEN_SECRET;

////////////////////Cloudinary configuration

cloudinary.config({
  cloud_name: "sarmad051",
  api_key: "394665138155273",
  api_secret: "kb59RuRC5N7pudX0qVlXHkwSAyk",
});

/////////////////////////////////////////// Registration of User

exports.Registration = async (req, res) => {
  try {
    const users = await admin.create(req.body);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "psycheglobe@gmail.com",
        pass: "Khansarmad@1996",
      },
    });

    const token = crypto.randomInt(0, 1000000);
    users.token = token;
    users.save();
    console.log(token);
    const mailOptions = {
      from: "psycheglobe@gmail.com",
      to: "sarmadhassanh11@gmail.com",
      subject: "Verification Code",
      text: `Enter verification code to activate your account:  ${token}`,
    };

    transporter.sendMail(mailOptions, function (err, data) {
      if (err) {
        console.log("Error " + err);
      } else {
        console.log("Email sent successfully");
      }
    });
    console.log(users);
    return res.status(200).send({
      msg: "A verififcation code is send on your given email address.Verify code to activate your account",
    });
  } catch (err) {
    {
      res.status(400).send({ success: false, err: err.message });
    }
  }
};

///////////////////////////////////////////  Verify Account

exports.verifyaccount = async (req, res) => {
  try {
    const findUser = await admin.findOne({
      email: req.params.email,
      token: req.params.token,
    });
    if (!findUser) {
      return res
        .status(400)
        .send({ msg: "Invalid email or verification code" });
    } else if (findUser.status === "Pending") {
      findUser.status = "Active";
      findUser.token = "";
      findUser.save();
      return res
        .status(200)
        .send({ msg: "Your account has been successfully verifiedy" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({ msg: "Error" });
  }
};

//////////////////////////Login

exports.loginUser = async function (req, res) {
  try {
    const user = await admin
      .findOne({ userName: req.query.username })
      .select("+password");
    const isCorrect = await bcrypt.compare(req.query.password, user.password);
    if (!isCorrect) return res.json({ message: "Password not match" });
    user.password = undefined;
    /// console.log(user);
    if (user.status == "Pending") {
      return res.status(400).send({
        msg: "Cannot login.Your account is not activated yet.Please activate your account",
      });
    }
    jwt.sign(
      { user },
      process.env.TOKEN_SECRET,
      { expiresIn: "3h" },
      (err, token) => {
        //console.log(token);
        res.json({ token });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(400).send({ msg: "Cannot Login" });
  }
};

////////////////////Publish Book
console.log();
exports.publishBook = async (req, res) => {
  try {
    // const publisherId = req.params.Id;
    // const publisher = await admin.findOne({ _id: publisherId })

    const user = req.admin;

    if (user.userType == "admin") {
      const newBooks = await books.create({
        publisherId: user._id,
        bookTitle: req.body.bookTitle,
        bookPrice: req.body.bookPrice,
        totalBooksAmount: req.body.totalBooksAmount,
      });
      console.log(newBooks);
      return res.status(200).send(newBooks);
    } else {
      res.status(403).send({ msg: "Only admin can publish books" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

exports.assignRole = async (req, res) => {
  //console.log(req.admin.userName)
  const userId = req.body.Id;
  const role = req.body.role;
  const user = req.admin;
  if (role != "admin") {
    return res
      .status(400)
      .send({ msg: `You can only assign the role of 'admin' to any user... ` });
  }
  // console.log(user.userType);
  //console.log(req.admin);
  const userRole = await admin.findOne({ _id: userId });
  try {
    if (user.userType != "admin") {
      return res.status(403).send({ msg: "Only Admin can assign the role" });
    } else if (!userRole) {
      return res.status(400).send({ msg: "Invalid user Id" });
    } else if (userRole.userType == "admin") {
      return res
        .status(400)
        .send({ msg: "User is already working as an admin" });
    } else if (userRole.userType == "user") {
      userRole.userType = role;
      userRole.save();
      return res
        .status(200)
        .send({ msg: "Successfully assign the role from user to admin" });
    } else {
      return res.status(400).send(error);
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

exports.updateBooks = async (req, res) => {
  try {
    const publisherId = req.params.Id;
    //const bookId = req.query.bookId;
    const publisher = await admin.findOne({ _id: publisherId });
    if (publisher.userType == "admin") {
      const newBooks = await books.findOneAndUpdate(
        { _id: req.body.bookId },
        {
          $set: {
            publisherId: publisher._id,
            bookTitle: req.body.bookTitle,
            bookPrice: req.body.bookPrice,
            totalBooksAmount: req.body.totalBooksAmount,
          },
        }
      );
      console.log(newBooks);
      return res.status(200).send(newBooks);
    } else {
      res.status(403).send({ msg: "Only admin can update books" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({ msg: "error" });
  }
};

exports.getAllBooks = async (req, res) => {
  try {
    const book = await books.find();
    return res.send(book);
  } catch (error) {
    console.log(error);
    res.status(400).send({ msg: "error" });
  }
};

exports.buyBooks = async (req, res) => {
  try {
    const booktitle = req.body.bookTitle;
    const quantity = req.body.quantity;
    const findBook = await books.findOne({ bookTitle: booktitle });

    //console.log(findBook);
    if (!findBook) {
      return res.status(400).send({ msg: "Book not found with this title" });
    }
    if (findBook.totalBooksAmount < quantity) {
      return res.status(400).send({
        msg: `Sorry! Books are out of stock.Only ${findBook.totalBooksAmount} books left.`,
      });
    }
    const remainingQuantity = findBook.totalBooksAmount - quantity;
    await books.findByIdAndUpdate(findBook._id, {
      totalBooksAmount: remainingQuantity,
    });

    return res.send({ msg: "Successfully buy books" });
  } catch (error) {
    console.log(error);
    res.status(400).send({ msg: "error" });
  }
};

exports.uploadImage = async (req, res, next) => {
  try {
    const data = req.file;
    console.log(data);
    // // console.log('req.body :', data.tempFilePath);

    await cloudinary.uploader
      .upload(`${data.path}`, {
        resource_type: "auto",
      })
      .then((result) => {
        res.status(200).send({
          message: "success",
          result,
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).send({
          message: "failure",
          error,
        });
      });
  } catch (error) {
    console.log(error);
  }
};
