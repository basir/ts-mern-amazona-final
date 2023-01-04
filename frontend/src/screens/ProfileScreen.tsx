import React, { useContext, useReducer, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { Store } from '../Store'
import { toast } from 'react-toastify'
import { getError } from '../utils'
import axios from 'axios'
import { Navigate, useNavigate } from 'react-router-dom'
import { ApiError } from '../types/ApiError'
import LoadingBox from '../components/LoadingBox'

type State = {
  loadingUpdate: boolean
  error: string
}
type Action =
  | { type: 'UPDATE_REQUEST' }
  | {
      type: 'UPDATE_SUCCESS'
    }
  | { type: 'UPDATE_FAIL' }
const initialState: State = {
  loadingUpdate: false,
  error: '',
}
const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true }
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false }
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false }

    default:
      return state
  }
}

export default function ProfileScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store)
  const { userInfo } = state
  const navigate = useNavigate()
  const [name, setName] = useState(userInfo!.name)
  const [email, setEmail] = useState(userInfo!.email)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [{ loadingUpdate }, dispatch] = useReducer<
    React.Reducer<State, Action>
  >(reducer, initialState)

  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    try {
      const { data } = await axios.put(
        '/api/users/profile',
        {
          name,
          email,
          password,
        },
        {
          headers: { Authorization: `Bearer ${userInfo!.token}` },
        }
      )
      dispatch({
        type: 'UPDATE_SUCCESS',
      })
      ctxDispatch({ type: 'USER_SIGNIN', payload: data })
      localStorage.setItem('userInfo', JSON.stringify(data))
      toast.success('User updated successfully')
    } catch (err) {
      dispatch({
        type: 'UPDATE_FAIL',
      })
      toast.error(getError(err as ApiError))
    }
  }

  return (
    <div className="container small-container">
      <Helmet>
        <title>User Profile</title>
      </Helmet>
      <h1 className="my-3">User Profile</h1>
      <form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>
        <div className="mb-3">
          <Button disabled={loadingUpdate} type="submit">
            Update
          </Button>
          {loadingUpdate && <LoadingBox></LoadingBox>}
        </div>
      </form>
    </div>
  )
}
