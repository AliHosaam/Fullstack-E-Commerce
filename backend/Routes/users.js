const express = require("express");
const moment = require("moment");
const User = require("../Models/user");
const bcrypt = require("bcrypt");

const router = express.Router();

// GETS ALL USERS

router.get("/", async (req, res) => {
  try {
    const users = await User.find().sort({ _id: -1 });

    res.status(200).send(users);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// GETS A USER

router.get("/find/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    res.status(200).send({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// UPDATES A USER

router.put("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user.email === req.body.email) {
      const emailInUse = await User.findOne({ email: req.body.email });

      if (emailInUse)
        return res.status(400).send("This email is already taken...");
    }

    if (req.body.password && user) {
      const genSalt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, genSalt);

      user.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        email: req.body.email,
        isAdmin: req.body.isAdmin,
        password: user.password,
      },
      { new: true }
    );

    res.status(200).send({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// DELETE A USER

router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    res.status(200).send(deletedUser);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// GET USER STATS

router.get("/stats", async (req, res) => {
  const previousMonth = moment()
    .month(moment().month() - 1)
    .set("date", 1)
    .format("YYYY-MM-DD HH:mm:ss");

  try {
    const users = await User.aggregate([
      {
        $match: { createdAt: { $gte: new Date(previousMonth) } },
      },
      {
        $project: { month: { $month: "$createdAt" } },
      },
      {
        $group: { _id: "$month", total: { $sum: 1 } },
      },
    ]);

    res.status(200).send(users);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = router;
