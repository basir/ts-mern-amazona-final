import express from 'express'

const keyRouter = express.Router()

keyRouter.get('/paypal', (req, res) => {
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID || 'sb' })
})

keyRouter.get('/google', (req, res) => {
  res.send({ key: process.env.GOOGLE_API_KEY || 'nokey' })
})

keyRouter.get('/stripe', (req, res) => {
  res.json({ key: process.env.STRIPE_PUBLISHABLE_KEY })
})

export default keyRouter
