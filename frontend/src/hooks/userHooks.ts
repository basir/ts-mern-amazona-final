import { useMutation, useQuery } from '@tanstack/react-query'
import { UserInfo } from '../types/UserInfo'
import apiClient from '../apiClient'
import { User } from '../types/User'

export const useSigninMutation = () =>
  useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string
      password: string
    }) =>
      (
        await apiClient.post<UserInfo>(`api/users/signin`, {
          email,
          password,
        })
      ).data,
  })

export const useSignupMutation = () =>
  useMutation({
    mutationFn: async ({
      name,
      email,
      password,
    }: {
      name: string
      email: string
      password: string
    }) =>
      (
        await apiClient.post<UserInfo>(`api/users/signup`, {
          name,
          email,
          password,
        })
      ).data,
  })

export const useUpdateProfileMutation = () =>
  useMutation({
    mutationFn: async ({
      name,
      email,
      password,
    }: {
      name: string
      email: string
      password: string
    }) =>
      (
        await apiClient.put<UserInfo>(`api/users/profile`, {
          name,
          email,
          password,
        })
      ).data,
  })

export const useGetUsersQuery = () =>
  useQuery({
    queryKey: ['users'],
    queryFn: async () => (await apiClient.get<[User]>(`api/users`)).data,
  })

export const useDeleteUserMutation = () =>
  useMutation({
    mutationFn: async (userId: string) =>
      (await apiClient.delete<{ message: string }>(`api/users/${userId}`)).data,
  })

export const useUpdateUserMutation = () =>
  useMutation({
    mutationFn: async (user: {
      _id: string
      name: string
      email: string
      isAdmin: boolean
    }) =>
      (
        await apiClient.put<{ user: User; message: string }>(
          `api/users/${user._id}`,
          user
        )
      ).data,
  })

export const useGetUserDetailsQuery = (userId: string) =>
  useQuery({
    queryKey: ['users', userId],
    queryFn: async () =>
      (await apiClient.get<User>(`api/users/${userId}`)).data,
  })
