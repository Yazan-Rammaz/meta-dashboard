import { Role } from '@/models/roles';
import { api } from '@/services/auth';

export interface GetRolesResponse {
  data: Role[];
}

export const RolesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getRoles: builder.query<Array<Role>, void>({
      query: () => ({
        url: '/roles',
        method: 'GET'
      }),
      transformResponse: (response: GetRolesResponse) => {
        return response.data;
      },
      providesTags: (result) =>
        // is result available?
        result
          ? // successful query
            [
              ...result.map(({ id }) => ({ type: 'Roles', id }) as const),
              { type: 'Roles', id: 'LIST' }
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
            [{ type: 'Roles', id: 'LIST' }]
    }),
    addRole: builder.mutation<Role, Partial<Role>>({
      query(body) {
        return {
          url: `/roles`,
          method: 'POST',
          body
        };
      },
      invalidatesTags: [{ type: 'Roles', id: 'LIST' }]
    }),
    updateRole: builder.mutation<Role, Partial<Role>>({
      query(body) {
        return {
          url: `/roles/update/${body.id}`,
          method: 'PUT',
          body
        };
      },
      invalidatesTags: [{ type: 'Roles', id: 'LIST' }]
    }),
    deleteRole: builder.mutation<Role, Partial<Role>>({
      query(body) {
        return {
          url: `/roles/destroy/${body.id}`,
          method: 'DELETE',
          body
        };
      },
      invalidatesTags: [{ type: 'Roles', id: 'LIST' }]
    })
  })
});

export const {
  useGetRolesQuery,
  useAddRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation
} = RolesApi;
