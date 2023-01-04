import React, { useContext, useEffect, useReducer, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import { Store } from '../Store'
import { getError } from '../utils'
import Container from 'react-bootstrap/Container'
import ListGroup from 'react-bootstrap/ListGroup'
import Form from 'react-bootstrap/Form'
import { Helmet } from 'react-helmet-async'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import Button from 'react-bootstrap/Button'
import { Product } from '../types/Product'
import { ApiError } from '../types/ApiError'

type State = {
  product?: Product
  loading: boolean
  error: string
  loadingUpload: boolean
  loadingUpdate: boolean
}
type Action =
  | { type: 'FETCH_REQUEST' }
  | { type: 'FETCH_SUCCESS' }
  | { type: 'FETCH_FAIL'; payload: string }
  | { type: 'UPDATE_REQUEST' }
  | { type: 'UPDATE_SUCCESS' }
  | { type: 'UPDATE_FAIL' }
  | { type: 'UPLOAD_REQUEST' }
  | { type: 'UPLOAD_SUCCESS' }
  | { type: 'UPLOAD_FAIL' }
const initialState: State = {
  loading: true,
  error: '',
  loadingUpload: false,
  loadingUpdate: false,
}
const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true }
    case 'FETCH_SUCCESS':
      return { ...state, loading: false }
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload }
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true }
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false }
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false }
    case 'UPLOAD_REQUEST':
      return { ...state, loadingUpload: true }
    case 'UPLOAD_SUCCESS':
      return {
        ...state,
        loadingUpload: false,
      }
    case 'UPLOAD_FAIL':
      return { ...state, loadingUpload: false }

    default:
      return state
  }
}
export default function ProductEditScreen() {
  const navigate = useNavigate()
  const params = useParams() // /product/:id
  const { id: productId } = params

  const { state } = useContext(Store)
  const { userInfo } = state
  const [{ loading, error, loadingUpload, loadingUpdate }, dispatch] =
    useReducer<React.Reducer<State, Action>>(reducer, initialState)

  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [price, setPrice] = useState('')
  const [image, setImage] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [category, setCategory] = useState('')
  const [countInStock, setCountInStock] = useState('')
  const [brand, setBrand] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' })
        const { data } = await axios.get(`/api/products/${productId}`)
        setName(data.name)
        setSlug(data.slug)
        setPrice(data.price)
        setImage(data.image)
        setImages(data.images)
        setCategory(data.category)
        setCountInStock(data.countInStock)
        setBrand(data.brand)
        setDescription(data.description)
        dispatch({ type: 'FETCH_SUCCESS' })
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err as ApiError),
        })
      }
    }
    fetchData()
  }, [productId])

  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    try {
      dispatch({ type: 'UPDATE_REQUEST' })
      await axios.put(
        `/api/products/${productId}`,
        {
          _id: productId,
          name,
          slug,
          price,
          image,
          images,
          category,
          brand,
          countInStock,
          description,
        },
        {
          headers: { Authorization: `Bearer ${userInfo!.token}` },
        }
      )
      dispatch({
        type: 'UPDATE_SUCCESS',
      })
      toast.success('Product updated successfully')
      navigate('/admin/products')
    } catch (err) {
      toast.error(getError(err as ApiError))
      dispatch({ type: 'UPDATE_FAIL' })
    }
  }
  const uploadFileHandler = async (
    e: React.FormEvent<HTMLInputElement>,
    forImages: boolean = false
  ) => {
    const file = e.currentTarget.files![0]
    const bodyFormData = new FormData()
    bodyFormData.append('file', file)
    try {
      dispatch({ type: 'UPLOAD_REQUEST' })
      const { data } = await axios.post('/api/upload', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${userInfo!.token}`,
        },
      })
      dispatch({ type: 'UPLOAD_SUCCESS' })

      if (forImages) {
        setImages([...images, data.secure_url])
      } else {
        setImage(data.secure_url)
      }
      toast.success('Image uploaded successfully. click Update to apply it')
    } catch (err) {
      toast.error(getError(err as ApiError))
      dispatch({ type: 'UPLOAD_FAIL' })
    }
  }
  const deleteFileHandler = async (fileName: string) => {
    setImages(images.filter((x) => x !== fileName))
    toast.success('Image removed successfully. click Update to apply it')
  }
  return (
    <Container className="small-container">
      <Helmet>
        <title>Edit Product ${productId}</title>
      </Helmet>
      <h1>Edit Product {productId}</h1>

      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="slug">
            <Form.Label>Slug</Form.Label>
            <Form.Control
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Price</Form.Label>
            <Form.Control
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="image">
            <Form.Label>Image File</Form.Label>
            <Form.Control
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="imageFile">
            <Form.Label>Upload Image</Form.Label>
            <input type="file" onChange={uploadFileHandler}></input>
            {loadingUpload && <LoadingBox></LoadingBox>}
          </Form.Group>

          <Form.Group className="mb-3" controlId="additionalImage">
            <Form.Label>Additional Images</Form.Label>
            {images.length === 0 && <MessageBox>No image</MessageBox>}
            <ListGroup variant="flush">
              {images.map((x) => (
                <ListGroup.Item key={x}>
                  {x}
                  <Button variant="light" onClick={() => deleteFileHandler(x)}>
                    <i className="fa fa-times-circle"></i>
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Form.Group>
          <Form.Group className="mb-3" controlId="additionalImageFile">
            <Form.Label>Upload Aditional Image</Form.Label>

            <input
              type="file"
              onChange={(e) => uploadFileHandler(e, true)}
            ></input>

            {loadingUpload && <LoadingBox></LoadingBox>}
          </Form.Group>

          <Form.Group className="mb-3" controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Control
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="brand">
            <Form.Label>Brand</Form.Label>
            <Form.Control
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="countInStock">
            <Form.Label>Count In Stock</Form.Label>
            <Form.Control
              value={countInStock}
              onChange={(e) => setCountInStock(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Form.Group>
          <div className="mb-3">
            <Button disabled={loadingUpdate} type="submit">
              Update
            </Button>
            {loadingUpdate && <LoadingBox></LoadingBox>}
          </div>
        </Form>
      )}
    </Container>
  )
}
