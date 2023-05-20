import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { UserModel } from '../models/userModel'
import { isAdmin, isAuth } from '../utils'
import { OrderModel } from '../models/orderModel'
import { Product, ProductModel } from '../models/productModel'
import Stripe from 'stripe'

export const orderRouter = express.Router()

orderRouter.get(
  '/',
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const orders = await OrderModel.find().populate('user', 'name')
    res.send(orders)
  })
)

orderRouter.get(
  '/summary',
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const orders = await OrderModel.aggregate([
      {
        $group: {
          _id: null,
          numOrders: { $sum: 1 },
          totalSales: { $sum: '$totalPrice' },
        },
      },
    ])
    const users = await UserModel.aggregate([
      {
        $group: {
          _id: null,
          numUsers: { $sum: 1 },
        },
      },
    ])
    const dailyOrders = await OrderModel.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          orders: { $sum: 1 },
          sales: { $sum: '$totalPrice' },
        },
      },
      { $sort: { _id: 1 } },
    ])
    const productCategories = await ProductModel.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ])
    res.send({ users, orders, dailyOrders, productCategories })
  })
)

orderRouter.get(
  '/mine',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const orders = await OrderModel.find({ user: req.user._id })
    res.send(orders)
  })
)

orderRouter.post(
  '/',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    if (req.body.orderItems.length === 0) {
      res.status(400).send({ message: 'Cart is empty' })
    } else {
      const createdOrder = await OrderModel.create({
        orderItems: req.body.orderItems.map((x: Product) => ({
          ...x,
          product: x._id,
        })),
        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod,
        itemsPrice: req.body.itemsPrice,
        shippingPrice: req.body.shippingPrice,
        taxPrice: req.body.taxPrice,
        totalPrice: req.body.totalPrice,
        user: req.user._id,
      })
      res.status(201).send({ message: 'Order Not Found', order: createdOrder })
    }
  })
)

orderRouter.get(
  '/:id',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const order = await OrderModel.findById(req.params.id)
    if (order) {
      res.send(order)
    } else {
      res.status(404).send({ message: 'Order Not Found' })
    }
  })
)

orderRouter.post(
  '/:id/stripe-payment-intent',
  asyncHandler(async (req, res) => {
    try {
      const order = await OrderModel.findById(req.params.id)
      if (!order) {
        res.status(404).send({ message: 'Order Not Found' })
        return
      }
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
        apiVersion: '2022-11-15',
      })
      const paymentIntent = await stripe.paymentIntents.create({
        amount: order.totalPrice * 100,
        currency: 'usd',
        payment_method_types: ['card'],
      })
      res.json({ clientSecret: paymentIntent.client_secret })
    } catch (error) {
      res.status(500).json({ error })
    }
  })
)

orderRouter.put(
  '/:id/pay',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const order = await OrderModel.findById(req.params.id).populate('user')

    if (order) {
      order.isPaid = true
      order.paidAt = new Date(Date.now())
      order.paymentResult =
        req.body.object === 'payment_intent' // stripe
          ? {
              paymentId: req.body.id,
              status: req.body.status,
              update_time: req.body.created,
              email_address: req.body.receipt_email,
            }
          : {
              // paypal
              paymentId: req.body.id,
              status: req.body.status,
              update_time: req.body.update_time,
              email_address: req.body.email_address,
            }
      const updatedOrder = await order.save()

      res.send(updatedOrder)
    } else {
      res.status(404).send({ message: 'Order Not Found' })
    }
  })
)

orderRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const order = await OrderModel.findById(req.params.id)
    if (order) {
      const deleteOrder = await order.deleteOne()
      res.send({ message: 'Order Deleted', order: deleteOrder })
    } else {
      res.status(404).send({ message: 'Order Not Found' })
    }
  })
)

orderRouter.put(
  '/:id/deliver',
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const order = await OrderModel.findById(req.params.id)
    if (order) {
      order.isDelivered = true
      order.deliveredAt = new Date(Date.now())
      // order.deliveredAt = Date.now();

      const updatedOrder = await order.save()
      res.send({ message: 'Order Delivered', order: updatedOrder })
    } else {
      res.status(404).send({ message: 'Order Not Found' })
    }
  })
)
