import { useEffect, useReducer, useState } from 'react'
import axios from 'axios'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ProductItem from '../components/ProductItem'
import { Helmet } from 'react-helmet-async'
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import { Product } from '../types/Product'
import { getError } from '../utils'
import { ApiError } from '../types/ApiError'
import { Link } from 'react-router-dom'

type State = {
  products: { featuredProducts: Product[]; latestProducts: Product[] }
  loading: boolean
  error: string
}
type Action =
  | { type: 'FETCH_REQUEST' }
  | {
      type: 'FETCH_SUCCESS'
      payload: { featuredProducts: Product[]; latestProducts: Product[] }
    }
  | { type: 'FETCH_FAIL'; payload: string }
const initialState: State = {
  products: { featuredProducts: [], latestProducts: [] },
  loading: true,
  error: '',
}
const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true }
    case 'FETCH_SUCCESS':
      return { ...state, products: action.payload, loading: false }
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload }
    default:
      return state
  }
}

function HomeScreen() {
  const [{ loading, error, products }, dispatch] = useReducer<
    React.Reducer<State, Action>
  >(reducer, initialState)
  const { featuredProducts, latestProducts } = products
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' })
      try {
        const result = await axios.get('/api/products')
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data })
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err as ApiError) })
      }

      // setProducts(result.data);
    }
    fetchData()
  }, [])
  return (
    <div>
      <Helmet>
        <title>Amazona</title>
      </Helmet>
      <Carousel showThumbs={false} autoPlay>
        {featuredProducts.map((product) => (
          <Link to={`/product/${product.slug}`} className="flex">
            <div key={product._id}>
              <img src={product.banner} alt={product.name} />
            </div>
          </Link>
        ))}
      </Carousel>

      <h1>Latest Products</h1>
      <div className="products">
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Row>
            {latestProducts.map((product: Product) => (
              <Col key={product.slug} sm={6} md={4} lg={3} className="mb-3">
                <ProductItem product={product}></ProductItem>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  )
}
export default HomeScreen
