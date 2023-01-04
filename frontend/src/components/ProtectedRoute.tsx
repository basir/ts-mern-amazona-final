import { Navigate } from 'react-router-dom'
import { ProtectedRouteProps } from '../types/ProtectedRouteProps'

export default function ProtectedRoute({
  isAuthenticated,
  authenticationPath,
  outlet,
}: ProtectedRouteProps) {
  if (isAuthenticated) {
    return outlet
  } else {
    return <Navigate to={{ pathname: authenticationPath }} />
  }
}
