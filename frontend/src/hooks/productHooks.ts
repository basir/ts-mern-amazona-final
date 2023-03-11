import { useMutation, useQuery } from '@tanstack/react-query'
import { Product, Review } from '../types/Product'
import apiClient from '../apiClient'

export const useGetProductsQuery = () =>
  useQuery({
    queryKey: ['products'],
    queryFn: async () =>
      (
        await apiClient.get<{
          featuredProducts: Product[]
          latestProducts: Product[]
        }>(`api/products`)
      ).data,
  })

export const useSearchProductsQuery = ({
  page,
  query,
  category,
  price,
  rating,
  order,
}: {
  page: number
  query: string
  category: string
  price: string
  rating: string
  order: string
}) =>
  useQuery({
    queryKey: ['products', page, query, category, price, rating, order],
    queryFn: async () =>
      (
        await apiClient.get<{
          products: Product[]
          countProducts: number
          pages: number
        }>(
          `/api/products/search?page=${page}&query=${query}&category=${category}&price=${price}&rating=${rating}&order=${order}`
        )
      ).data,
  })
export const useGetProductDetailsBySlugQuery = (slug: string) =>
  useQuery({
    queryKey: ['products', slug],
    queryFn: async () =>
      (await apiClient.get<Product>(`api/products/slug/${slug}`)).data,
  })

export const useGetProductDetailsQuery = (id: string) =>
  useQuery({
    queryKey: ['products', id],
    queryFn: async () =>
      (await apiClient.get<Product>(`api/products/${id}`)).data,
  })

export const useGetCategoriesQuery = () =>
  useQuery({
    queryKey: ['categories'],
    queryFn: async () =>
      (await apiClient.get<[]>(`/api/products/categories`)).data,
  })

export const useCreateReviewMutation = () =>
  useMutation({
    mutationFn: async ({
      name,
      rating,
      comment,
      productId,
    }: {
      name: string
      rating: number
      comment: string
      productId: string
    }) =>
      (
        await apiClient.post<Review>(`api/products/${productId}/reviews`, {
          name,
          rating,
          comment,
        })
      ).data,
  })

// Admin

export const useGetAdminProdcutsQuery = (page: number) =>
  useQuery({
    queryKey: ['admin-products', page],
    queryFn: async () =>
      (
        await apiClient.get<{
          products: [Product]
          page: number
          pages: number
        }>(`/api/products/admin?page=${page}`)
      ).data,
  })

export const useCreateProductMutation = () =>
  useMutation({
    mutationFn: async () =>
      (
        await apiClient.post<{ product: Product; message: string }>(
          `api/products`
        )
      ).data,
  })
export const useDeleteProductMutation = () =>
  useMutation({
    mutationFn: async (productId: string) =>
      (await apiClient.delete(`api/products/${productId}`)).data,
  })

export const useUpdateProductMutation = () =>
  useMutation({
    mutationFn: async (product: {
      _id: string
      name: string
      slug: string
      price: number
      image: string
      images: string[]
      category: string
      brand: string
      countInStock: number
      description: string
    }) =>
      (
        await apiClient.put<{ product: Product; message: string }>(
          `api/products/${product._id}`,
          product
        )
      ).data,
  })

export const useUploadProductMutation = () =>
  useMutation({
    mutationFn: async (formData: FormData) =>
      (
        await apiClient.post<{ secure_url: string }>(
          `api/uploads/local`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        )
      ).data,
  })
