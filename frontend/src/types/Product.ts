export type Product = {
  _id: string
  name: string
  image: string
  banner: string
  category: string
  brand: string
  description: string
  reviews: Review[]
  slug: string
  images: string[]
  rating: number
  numReviews: number
  price: number
  countInStock: number
  isFeatured: boolean
}
export type Review = {
  _id: string
  createdAt: string
  name: string
  rating: number
  comment: string
}
