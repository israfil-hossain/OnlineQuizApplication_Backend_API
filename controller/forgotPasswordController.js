const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");
const User = require("../models/People");
const crypto = require("crypto");

const transporter = nodemailer.createTransport({
  host: "mail.mrcsaid.com",
  port: 465,
  secure: true,
  auth: {
    user: "contact@mrcsaid.com",
    pass: "Surgeon2023#",
  },
});

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("This User does not exist");
    }
    console.log("email", email);
    const resetToken = crypto.randomBytes(20).toString("hex");
    console.log("reset token ", resetToken);

    user.resetToken = resetToken;
    await user.save();

    const mailOptions = {
      from: "contact@mrcsaid.com",
      to: email,
      subject: "Reset Your password",
      text: `Click the following link to reset your password : https://mrcsaid.com/reset-password/${resetToken}`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).send("Failed to send reset email");
      } else {
        console.log("Email sent : " + info.response);
        res.status(200).send(`Password reset email sent ${info.response}`);
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await User.findOne({ resetToken: token });
    if (!user) {
      return res.status(404).send("User does not exist");
    }
    user.password = newPassword;
    user.resetToken = undefined;
    await user.save();
    res.status(200).send("Password reset successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  forgotPassword,
  resetPassword,
};
