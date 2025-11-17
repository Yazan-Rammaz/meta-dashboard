import { api } from '@/services/auth';
import { Client } from '@/types/clients';

export interface GetClientsResponse {
  data: Client[];
}

export const ClientsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getClients: builder.query<Array<Client>, void>({
      query: () => ({
        url: '/clients',
        method: 'GET'
      }),
      transformResponse: (response: GetClientsResponse) => {
        return response.data;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Clients', id }) as const),
              { type: 'Clients', id: 'LIST' }
            ]
          : [{ type: 'Clients', id: 'LIST' }]
    }),
    addClient: builder.mutation<Client, Partial<Client>>({
      query(body) {
        return {
          url: `/clients`,
          method: 'POST',
          body
        };
      },
      invalidatesTags: [{ type: 'Clients', id: 'LIST' }]
    }),
    updateClient: builder.mutation<Client, Partial<Client>>({
      query(body) {
        return {
          url: `/clients/${body.id}`,
          method: 'PUT',
          body
        };
      },
      invalidatesTags: [{ type: 'Clients', id: 'LIST' }]
    }),
    deleteClient: builder.mutation<Client, Partial<Client>>({
      query(body) {
        return {
          url: `/clients/${body.id}`,
          method: 'DELETE',
          body
        };
      },
      invalidatesTags: [{ type: 'Clients', id: 'LIST' }]
    })
  })
});

export const {
  useGetClientsQuery,
  useAddClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation
} = ClientsApi;
