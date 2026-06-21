import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { clearCredentials, setCredentials, setUser } from '../auth/authSlice.js';

const normalizeApiBaseUrl = (url, fallback) => {
  if (!url) return fallback;
  const trimmed = url.toString().trim().replace(/\/$/, '');
  if (trimmed.endsWith('/api') || trimmed.endsWith('/api/admin')) return trimmed;
  if (trimmed.includes('/api/')) return trimmed;
  return `${trimmed}/api`;
};

const apiBaseUrl = normalizeApiBaseUrl(import.meta.env.VITE_API_URL, 'http://localhost:5000/api');
const defaultAdminBaseUrl = apiBaseUrl.replace(/\/api\/?$/, '/api/admin');
const adminBaseUrl = normalizeApiBaseUrl(import.meta.env.VITE_ADMIN_API_URL, defaultAdminBaseUrl);

const prepareAuthHeaders = (headers, { getState }) => {
  const token = getState().auth.token;
  if (token) headers.set('authorization', `Bearer ${token}`);
  return headers;
};

const authBaseQuery = fetchBaseQuery({
  baseUrl: apiBaseUrl,
  credentials: 'include',
  prepareHeaders: prepareAuthHeaders,
});

const adminBaseQuery = fetchBaseQuery({
  baseUrl: adminBaseUrl,
  credentials: 'include',
  prepareHeaders: prepareAuthHeaders,
});

const isAuthRequest = (request) => {
  const url = typeof request === 'string' ? request : request?.url;
  if (!url) return false;
  return url.startsWith('/auth') || url.startsWith(`${apiBaseUrl}/auth`) || url.includes('/api/auth');
};

const baseQueryWithRefresh = async (args, api, extraOptions) => {
  const targetBaseQuery = isAuthRequest(args) ? authBaseQuery : adminBaseQuery;
  let result = await targetBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401 && !isAuthRequest(args)) {
    const refresh = await authBaseQuery({ url: '/auth/refresh', method: 'POST' }, api, extraOptions);
    const refreshData = refresh.data?.data ?? refresh.data;
    if (refreshData?.accessToken) {
      api.dispatch(setCredentials({ ...refreshData, remember: true }));
      result = await targetBaseQuery(args, api, extraOptions);
    } else {
      api.dispatch(clearCredentials());
    }
  }

  return result;
};

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: baseQueryWithRefresh,
  tagTypes: [
    'Auth',
    'Dashboard',
    'Resource',
    'Products',
    'Categories',
    'Brands',
    'Orders',
    'Customers',
    'Inventory',
    'Reports',
  ],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        if (data.data?.accessToken) {
          dispatch(setCredentials({ ...data.data, remember: args.remember }));
        }
      },
    }),
    verifyTwoFactor: builder.mutation({
      query: (body) => ({ url: '/auth/2fa/verify', method: 'POST', body }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(setCredentials({ ...data.data, remember: args.remember }));
      },
    }),
    logout: builder.mutation({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          dispatch(clearCredentials());
        }
      },
    }),
    me: builder.query({
      query: () => '/auth/me',
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(setUser(data.data.user));
      },
      providesTags: ['Auth'],
    }),
    forgotPassword: builder.mutation({
      query: (body) => ({ url: '/auth/forgot-password', method: 'POST', body }),
    }),
    resetPassword: builder.mutation({
      query: (body) => ({ url: '/auth/reset-password', method: 'POST', body }),
    }),
    changePassword: builder.mutation({
      query: (body) => ({ url: '/auth/change-password', method: 'PATCH', body }),
    }),
    enableTwoFactor: builder.mutation({
      query: () => ({ url: '/auth/2fa/enable', method: 'POST' }),
      invalidatesTags: ['Auth'],
    }),
    disableTwoFactor: builder.mutation({
      query: () => ({ url: '/auth/2fa/disable', method: 'POST' }),
      invalidatesTags: ['Auth'],
    }),
    dashboard: builder.query({
      query: () => '/dashboard',
      providesTags: ['Dashboard'],
    }),
    listResource: builder.query({
      query: ({ resource, ...params }) => ({ url: `/${resource}`, params }),
      providesTags: (result, error, arg) => [{ type: 'Resource', id: arg.resource }],
    }),
    getResource: builder.query({
      query: ({ resource, id }) => `/${resource}/${id}`,
      providesTags: (result, error, arg) => [{ type: 'Resource', id: `${arg.resource}-${arg.id}` }],
    }),
    createResource: builder.mutation({
      query: ({ resource, body }) => ({ url: `/${resource}`, method: 'POST', body }),
      invalidatesTags: (result, error, arg) => [{ type: 'Resource', id: arg.resource }, 'Dashboard'],
    }),
    updateResource: builder.mutation({
      query: ({ resource, id, body }) => ({ url: `/${resource}/${id}`, method: 'PATCH', body }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Resource', id: arg.resource },
        { type: 'Resource', id: `${arg.resource}-${arg.id}` },
        'Dashboard',
      ],
    }),
    deleteResource: builder.mutation({
      query: ({ resource, id }) => ({ url: `/${resource}/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, arg) => [{ type: 'Resource', id: arg.resource }, 'Dashboard'],
    }),
    restoreResource: builder.mutation({
      query: ({ resource, id }) => ({ url: `/${resource}/${id}/restore`, method: 'PATCH' }),
      invalidatesTags: (result, error, arg) => [{ type: 'Resource', id: arg.resource }, 'Dashboard'],
    }),
    report: builder.query({
      query: (params) => ({ url: '/reports', params }),
      providesTags: ['Reports'],
    }),
  }),
});

export const {
  useLoginMutation,
  useVerifyTwoFactorMutation,
  useLogoutMutation,
  useMeQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useEnableTwoFactorMutation,
  useDisableTwoFactorMutation,
  useDashboardQuery,
  useListResourceQuery,
  useGetResourceQuery,
  useCreateResourceMutation,
  useUpdateResourceMutation,
  useDeleteResourceMutation,
  useRestoreResourceMutation,
  useReportQuery,
} = adminApi;
