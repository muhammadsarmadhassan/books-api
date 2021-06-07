// const userFind = await admin.findOne({ userType: req.body.userType })
// //console.log(userFind);
// if (userFind) {

//     return res.send({ msg: 'Admin already exist.You can only log in as a user.' });

// } else {
//     const users = await admin.create(req.body);
//     console.log(users);

//     const transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//             user: 'psycheglobe@gmail.com',
//             pass: 'Khansarmad@1996'
//         }
//     });

//     const token = (crypto.randomInt(0, 1000000));
//     users.token = token;
//     users.save();
//     console.log(token);
//     const mailOptions = {
//         from: 'psycheglobe@gmail.com',
//         to: 'sarmadhassanh11@gmail.com',
//         subject: 'Verification Code',
//         text: `Enter verification code to activate your account:  ${token}`,
//     };

//     transporter.sendMail(mailOptions, function (err, data) {
//         if (err) {
//             console.log("Error " + err);
//         } else {
//             console.log("Email sent successfully");
//         }
//     });
//     console.log(users);
//     return res.status(200).send({ msg: 'A verififcation code is send on your given email address.Verify code to activate your account' });
// }



//     } catch (err) {
//     { res.status(400).send({ success: false, err: err.message }) }
// }

