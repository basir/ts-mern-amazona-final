import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { User, UserModel } from '../models/userModel'
import bcrypt from 'bcryptjs'
import { generateToken, isAdmin, isAuth } from '../utils'

export const userRouter = express.Router()

userRouter.get('/:id', async (req, res) => {
  const user = await UserModel.findById(req.params.id)
  if (user) {
    res.send(user)
  } else {
    res.status(404).send({ message: 'User Not Found' })
  }
})

userRouter.get(
  '/',
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const users = await UserModel.find({})
    res.send(users)
  })
)

userRouter.post(
  '/signin',
  asyncHandler(async (req: Request, res: Response) => {
    const user = await UserModel.findOne({ email: req.body.email })
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user),
        })
        return
      }
    }
    res.status(401).send({ message: 'Invalid email or password' })
  })
)

userRouter.post(
  '/signup',
  asyncHandler(async (req: Request, res: Response) => {
    const user = await UserModel.create({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
    } as User)

    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user),
    })
  })
)

userRouter.put(
  '/profile',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const user = await UserModel.findById(req.user._id)
    if (user) {
      user.name = req.body.name || user.name
      user.email = req.body.email || user.email

      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8)
      }
      const updatedUser = await user.save()
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser),
      })
    }
  })
)
userRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const user = await UserModel.findById(req.params.id)
    if (user) {
      user.name = req.body.name || user.name
      user.email = req.body.email || user.email
      user.isAdmin = Boolean(req.body.isAdmin)
      const updatedUser = await user.save()
      res.send({ message: 'User Updated', user: updatedUser })
    } else {
      res.status(404).send({ message: 'User Not Found' })
    }
  })
)

userRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const user = await UserModel.findById(req.params.id)
    if (user) {
      if (user.email === 'admin@example.com') {
        res.status(400).send({ message: 'Can Not Delete Admin User' })
        return
      }
      const deleteUser = await user.deleteOne()
      res.send({ message: 'User Deleted', user: deleteUser })
    } else {
      res.status(404).send({ message: 'User Not Found' })
    }
  })
)
