export type Product = {
  category: string
  brand: string
  description: string
  reviews: any
  _id: string
  slug: number
  image: string
  images: string[]
  rating: number
  numReviews: number
  price: number
  countInStock: number
  name: string
}
export type Review = {
  _id: string
  createdAt: string
  name: string
  rating: number
  comment: string
}
