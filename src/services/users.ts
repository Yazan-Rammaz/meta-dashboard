import { api } from '@/services/auth';
import { User } from '@/types/users';

export interface GetUsersResponse {
  data: User[];
}

export const UsersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<Array<User>, void>({
      query: () => ({
        url: '/users',
        method: 'GET'
      }),
      transformResponse: (response: GetUsersResponse) => {
        return response.data;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Users', id }) as const),
              { type: 'Users', id: 'LIST' }
            ]
          : [{ type: 'Users', id: 'LIST' }]
    }),
    addUser: builder.mutation<User, Partial<User>>({
      query(body) {
        return {
          url: `/users`,
          method: 'POST',
          body
        };
      },
      invalidatesTags: [{ type: 'Users', id: 'LIST' }]
    }),
    updateUser: builder.mutation<User, Partial<User>>({
      query(body) {
        return {
          url: `/users/${body.id}`,
          method: 'PUT',
          body
        };
      },
      invalidatesTags: [{ type: 'Users', id: 'LIST' }]
    }),
    deleteUser: builder.mutation<User, Partial<User>>({
      query(body) {
        return {
          url: `/users/${body.id}`,
          method: 'DELETE',
          body
        };
      },
      invalidatesTags: [{ type: 'Users', id: 'LIST' }]
    })
  })
});

export const {
  useGetUsersQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation
} = UsersApi;
