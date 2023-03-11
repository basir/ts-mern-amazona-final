import { Link, useNavigate, useLocation } from 'react-router-dom'
import { getError } from '../utils'
import { Helmet } from 'react-helmet-async'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Rating from '../components/Rating'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import Button from 'react-bootstrap/Button'
import ProductItem from '../components/ProductItem'
import { LinkContainer } from 'react-router-bootstrap'
import { ApiError } from '../types/ApiError'
import {
  useGetCategoriesQuery,
  useSearchProductsQuery,
} from '../hooks/productHooks'

const prices = [
  {
    name: '$1 to $50',
    value: '1-50',
  },
  {
    name: '$51 to $200',
    value: '51-200',
  },
  {
    name: '$201 to $1000',
    value: '201-1000',
  },
]

export const ratings = [
  {
    name: '4stars & up',
    rating: 4,
  },

  {
    name: '3stars & up',
    rating: 3,
  },

  {
    name: '2stars & up',
    rating: 2,
  },

  {
    name: '1stars & up',
    rating: 1,
  },
]

export default function SearchScreen() {
  const navigate = useNavigate()
  const { search } = useLocation()
  const sp = new URLSearchParams(search)
  const category = sp.get('category') || 'all'
  const query = sp.get('query') || 'all'
  const price = sp.get('price') || 'all'
  const rating = sp.get('rating') || 'all'
  const order = sp.get('order') || 'newest'
  const page = Number(sp.get('page') || 1)

  const { data, isLoading, error } = useSearchProductsQuery({
    category,
    order,
    page,
    price,
    query,
    rating,
  })

  const {
    data: categories,
    isLoading: loadingCategories,
    error: errorCategories,
  } = useGetCategoriesQuery()

  const getFilterUrl = (
    filter: {
      category?: string
      price?: string
      rating?: string
      order?: string
      page?: number
      query?: string
    },
    skipPathname: boolean = false
  ) => {
    const filterPage = filter.page || page
    const filterCategory = filter.category || category
    const filterQuery = filter.query || query
    const filterRating = filter.rating || rating
    const filterPrice = filter.price || price
    const sortOrder = filter.order || order
    return `${
      skipPathname ? '' : '/search?'
    }category=${filterCategory}&query=${filterQuery}&price=${filterPrice}&rating=${filterRating}&order=${sortOrder}&page=${filterPage}`
  }
  return (
    <div>
      <Helmet>
        <title>Search Products</title>
      </Helmet>
      <Row>
        <Col md={3}>
          <h3>Department</h3>
          <div>
            <ul>
              <li>
                <Link
                  className={'all' === category ? 'text-bold' : ''}
                  to={getFilterUrl({ category: 'all' })}
                >
                  Any
                </Link>
              </li>

              {loadingCategories ? (
                <LoadingBox />
              ) : error ? (
                <MessageBox variant="danger">
                  {getError(errorCategories as ApiError)}
                </MessageBox>
              ) : (
                categories!.map((c) => (
                  <li key={c}>
                    <Link
                      className={c === category ? 'text-bold' : ''}
                      to={getFilterUrl({ category: c })}
                    >
                      {c}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>
          <div>
            <h3>Price</h3>
            <ul>
              <li>
                <Link
                  className={'all' === price ? 'text-bold' : ''}
                  to={getFilterUrl({ price: 'all' })}
                >
                  Any
                </Link>
              </li>
              {prices.map((p) => (
                <li key={p.value}>
                  <Link
                    to={getFilterUrl({ price: p.value })}
                    className={p.value === price ? 'text-bold' : ''}
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Avg. Customer Review</h3>
            <ul>
              {ratings.map((r) => (
                <li key={r.name}>
                  <Link
                    to={getFilterUrl({ rating: r.rating.toString() })}
                    className={`${r.rating}` === `${rating}` ? 'text-bold' : ''}
                  >
                    <Rating caption={' & up'} rating={r.rating}></Rating>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to={getFilterUrl({ rating: 'all' })}
                  className={rating === 'all' ? 'text-bold' : ''}
                >
                  <Rating caption={' & up'} rating={0}></Rating>
                </Link>
              </li>
            </ul>
          </div>
        </Col>
        <Col md={9}>
          {isLoading ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <MessageBox variant="danger">
              {getError(error as ApiError)}
            </MessageBox>
          ) : (
            <>
              <Row className="justify-content-between mb-3">
                <Col md={6}>
                  <div>
                    {data!.countProducts === 0 ? 'No' : data!.countProducts}{' '}
                    Results
                    {query !== 'all' && ' : ' + query}
                    {category !== 'all' && ' : ' + category}
                    {price !== 'all' && ' : Price ' + price}
                    {rating !== 'all' && ' : Rating ' + rating + ' & up'}
                    {query !== 'all' ||
                    category !== 'all' ||
                    rating !== 'all' ||
                    price !== 'all' ? (
                      <Button
                        variant="light"
                        onClick={() => navigate('/search')}
                      >
                        <i className="fas fa-times-circle"></i>
                      </Button>
                    ) : null}
                  </div>
                </Col>
                <Col className="text-end">
                  Sort by{' '}
                  <select
                    value={order}
                    onChange={(e) => {
                      navigate(getFilterUrl({ order: e.target.value }))
                    }}
                  >
                    <option value="newest">Newest Arrivals</option>
                    <option value="lowest">Price: Low to High</option>
                    <option value="highest">Price: High to Low</option>
                    <option value="toprated">Avg. Customer Reviews</option>
                  </select>
                </Col>
              </Row>
              {data!.products.length === 0 && (
                <MessageBox>No Product Found</MessageBox>
              )}

              <Row>
                {data!.products.map((product) => (
                  <Col sm={6} lg={4} className="mb-3" key={product._id}>
                    <ProductItem product={product}></ProductItem>
                  </Col>
                ))}
              </Row>

              <div>
                {[...Array(data!.pages).keys()].map((x) => (
                  <LinkContainer
                    key={x + 1}
                    className="mx-1"
                    to={{
                      pathname: '/search',
                      search: getFilterUrl({ page: x + 1 }, true),
                    }}
                  >
                    <Button
                      className={Number(page) === x + 1 ? 'text-bold' : ''}
                      variant="light"
                    >
                      {x + 1}
                    </Button>
                  </LinkContainer>
                ))}
              </div>
            </>
          )}
        </Col>
      </Row>
    </div>
  )
}
