import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = import.meta.env.VITE_ADMIN_API_URL || 'http://localhost:5000/api/admin';

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Dashboard', 'Products', 'Categories', 'Brands', 'Orders', 'Customers', 'Inventory', 'Coupons', 'Reviews', 'Banners', 'CMS', 'Notifications', 'Users', 'Roles', 'Permissions', 'Settings', 'ActivityLogs', 'Reports'],
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Dashboard'],
    }),
    verifyTwoFactor: builder.mutation({
      query: (data) => ({
        url: '/verify-2fa',
        method: 'POST',
        body: data,
      }),
    }),
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: '/forgot-password',
        method: 'POST',
        body: data,
      }),
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: '/reset-password',
        method: 'POST',
        body: data,
      }),
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: '/change-password',
        method: 'POST',
        body: data,
      }),
    }),

    // Dashboard
    dashboard: builder.query({
      query: () => '/dashboard',
      providesTags: ['Dashboard'],
    }),

    // Generic CRUD
    listResource: builder.query({
      query: ({ resource, page = 1, limit = 10, search = '' }) => ({
        url: `/${resource}`,
        params: { page, limit, search },
      }),
      providesTags: (result, error, { resource }) => [{ type: resource.toUpperCase(), id: 'LIST' }],
    }),
    getResource: builder.query({
      query: ({ resource, id }) => `/${resource}/${id}`,
      providesTags: (result, error, { resource, id }) => [{ type: resource.toUpperCase(), id }],
    }),
    createResource: builder.mutation({
      query: ({ resource, body }) => ({
        url: `/${resource}`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, { resource }) => [{ type: resource.toUpperCase(), id: 'LIST' }],
    }),
    updateResource: builder.mutation({
      query: ({ resource, id, body }) => ({
        url: `/${resource}/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { resource, id }) => [
        { type: resource.toUpperCase(), id },
        { type: resource.toUpperCase(), id: 'LIST' },
      ],
    }),
    deleteResource: builder.mutation({
      query: ({ resource, id }) => ({
        url: `/${resource}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { resource }) => [{ type: resource.toUpperCase(), id: 'LIST' }],
    }),

    // Reports
    report: builder.query({
      query: ({ type, format = 'json' }) => ({
        url: `/reports/${type}`,
        params: { format },
      }),
      providesTags: ['Reports'],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useVerifyTwoFactorMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useDashboardQuery,
  useListResourceQuery,
  useGetResourceQuery,
  useCreateResourceMutation,
  useUpdateResourceMutation,
  useDeleteResourceMutation,
  useReportQuery,
} = adminApi;