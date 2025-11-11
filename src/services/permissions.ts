import { api } from '@/services/auth';

export interface Permission {
  id: string;
  name: string;
  guard_name: string;
  title: string; // Added title property
  description: string; // Added description property
  created_at: string;
  updated_at: string;
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
