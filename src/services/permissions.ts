import { api } from '@/services/auth';

export interface Permission {
  id: string;
  key: string;
  description: string;
  created_at: string;
  // name: string;
  // guard_name: string;
  // title: string; // Added title property
  // updated_at: string;
}

export interface GetPermissionsResponse {
  data: Permission[];
}

export const permissionsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getpermissions: builder.query<Array<Permission>, void>({
      query: () => ({
        url: '/users/me/permissions',
        method: 'GET'
      }),
      transformResponse: (response: GetPermissionsResponse) => {
        return response.data;
      }
    }),
    getAllPermissions: builder.query<Array<Permission>, void>({
      query: () => ({
        url: '/permissions/get_permissions',
        method: 'GET'
      }),
      transformResponse: (response: GetPermissionsResponse) => {
        return response.data;
      }
    }),
    getAllPermissionsBySearch: builder.mutation<Array<Permission>, string>({
      query: (body) => ({
        url: `/permissions/get_permissions?search_word=${body}`,
        method: 'GET'
      }),
      transformResponse: (response: GetPermissionsResponse) => {
        return response.data;
      }
    })
  })
});
export const {
  useGetpermissionsQuery,
  useGetAllPermissionsBySearchMutation,
  useGetAllPermissionsQuery
} = permissionsApi;
