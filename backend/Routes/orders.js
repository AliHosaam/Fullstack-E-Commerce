const express = require("express");
const moment = require("moment");
const Order = require("../Models/order");

const router = express.Router();

// GET ORDERS STATS

router.get("/", async (req, res) => {
  const query = req.query.new;

  try {
    const orders = query
      ? await Order.find().sort({ _id: -1 }).limit(4)
      : await Order.find().sort({ _id: -1 });

    res.status(200).send(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// EDIT AN ORDER

router.put("/:id", async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
    res.status(200).send(updatedOrder);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// GET AN ORDER

router.get("/findOne/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (req.user_id !== order.userId || !req.user.isAdmin)
      return res.status(403).send("Access denied, Not Authorized");

    res.status(200).send(order);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// GET ORDER STATS

router.get("/stats", async (req, res) => {
  const previousMonth = moment()
    .month(moment().month() - 1)
    .set("date", 1)
    .format("YYYY-MM-DD HH:mm:ss");

  try {
    const orders = await Order.aggregate([
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

    res.status(200).send(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// GET INCOME STATS

router.get("/income/stats", async (req, res) => {
  const previousMonth = moment()
    .month(moment().month() - 1)
    .set("date", 1)
    .format("YYYY-MM-DD HH:mm:ss");

  try {
    const income = await Order.aggregate([
      {
        $match: { createdAt: { $gte: new Date(previousMonth) } },
      },
      {
        $project: { month: { $month: "$createdAt" }, sales: "$total" },
      },
      {
        $group: { _id: "$month", total: { $sum: "$sales" } },
      },
    ]);

    res.status(200).send(income);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// GET 1 WEEK SALES

router.get("/week-sales", async (req, res) => {
  const last7days = moment()
    .day(moment().day() - 7)
    .format("YYYY-MM-DD HH:mm:ss");

  try {
    const income = await Order.aggregate([
      {
        $match: { createdAt: { $gte: new Date(last7days) } },
      },
      {
        $project: { day: { $dayOfWeek: "$createdAt" }, sales: "$total" },
      },
      {
        $group: { _id: "$day", total: { $sum: "$sales" } },
      },
    ]);

    res.status(200).send(income);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = router;
