const express = require("express");
const {
  getOrders,
  createOrder,
  deleteOrder,
  updateOrderStatus,
} = require("../Controllers/orderController");

const orderRouter = express.Router();
// GET all orders or orders by user
// http://localhost:5000/api/orders
orderRouter.get("/", getOrders);

// POST create a new order
orderRouter.post("/", createOrder);

// DELETE an order by ID
orderRouter.delete("/:orderId", deleteOrder);

//Update order status
orderRouter.patch("/update-status", updateOrderStatus);

module.exports = orderRouter;
