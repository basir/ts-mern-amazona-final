import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import streamifier from 'streamifier'
import express, { Request, Response } from 'express'
import { isAdmin, isAuth } from '../utils'

export const uploadRouter = express.Router()

const upload = multer()
uploadRouter.post(
  '/cloudinary',
  isAuth,
  isAdmin,
  upload.single('image'),

  async (req: Request, res: Response) => {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    })

    const streamUpload = (req: Request) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          (error: Error, result: Response) => {
            if (result) {
              resolve(result)
            } else {
              reject(error)
            }
          }
        )
        if (!req.file) throw Error('req.file is null')
        streamifier.createReadStream(req.file.buffer).pipe(stream)
      })
    }
    const result = await streamUpload(req)
    res.send(result)
  }
)

// LOCAL UPLOAD
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/')
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}.jpg`)
  },
})

const uploadLocal = multer({ storage })

uploadRouter.post(
  '/local',
  isAuth,
  uploadLocal.single('image'),
  (req: Request, res: Response) => {
    if (!req.file) throw Error('req.file is null')
    res.send({
      secure_url: `/${req.file.path}`,
    })
  }
)
