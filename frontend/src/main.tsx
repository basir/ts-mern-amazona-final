import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import 'bootstrap/dist/css/bootstrap.min.css'
import { StoreProvider } from './Store'
import App from './App'
import './index.css'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom'
import ProductScreen from './screens/ProductScreen'
import CartScreen from './screens/CartScreen'
import SearchScreen from './screens/SearchScreen'
import SigninScreen from './screens/SigninScreen'
import SignupScreen from './screens/SignupScreen'
import ProtectedRoute from './components/ProtectedRoute'
import ProfileScreen from './screens/ProfileScreen'
import PlaceOrderScreen from './screens/PlaceOrderScreen'
import OrderScreen from './screens/OrderScreen'
import OrderHistoryScreen from './screens/OrderHistoryScreen'
import ShippingAddressScreen from './screens/ShippingAddressScreen'
import PaymentMethodScreen from './screens/PaymentMethodScreen'
import UserListScreen from './screens/UserListScreen'
import ProductListScreen from './screens/ProductListScreen'
import ProductEditScreen from './screens/ProductEditScreen'
import UserEditScreen from './screens/UserEditScreen'
import HomeScreen from './screens/HomeScreen'
import OrderListScreen from './screens/OrderListScreen'
import AdminRoute from './components/AdminRoute'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import DashboardScreen from './screens/DashboardScreen'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<HomeScreen />} />
      <Route path="/product/:slug" element={<ProductScreen />} />
      <Route path="/cart" element={<CartScreen />} />
      <Route path="/search" element={<SearchScreen />} />
      <Route path="/signin" element={<SigninScreen />} />
      <Route path="/signup" element={<SignupScreen />} />

      {/* Normal Users */}
      <Route path="" element={<ProtectedRoute />}>
        <Route path="/orderhistory" element={<OrderHistoryScreen />} />
        <Route path="/shipping" element={<ShippingAddressScreen />} />
        <Route path="/payment" element={<PaymentMethodScreen />} />
        <Route path="/placeorder" element={<PlaceOrderScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/order/:id" element={<OrderScreen />} />
      </Route>
      {/* Admin Users */}
      <Route path="/admin" element={<AdminRoute />}>
        <Route path="dashboard" element={<DashboardScreen />} />
        <Route path="users" element={<UserListScreen />} />
        <Route path="user/:id" element={<UserEditScreen />} />
        <Route path="products" element={<ProductListScreen />} />
        <Route path="product/:id" element={<ProductEditScreen />} />
        <Route path="orders" element={<OrderListScreen />} />
      </Route>
    </Route>
  )
)

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <StoreProvider>
      <HelmetProvider>
        <PayPalScriptProvider
          options={{ 'client-id': 'sb' }}
          deferLoading={true}
        >
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </PayPalScriptProvider>
      </HelmetProvider>
    </StoreProvider>
  </React.StrictMode>
)
