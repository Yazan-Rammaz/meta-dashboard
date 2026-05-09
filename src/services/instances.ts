import { api } from '@/services/auth';
import { Instance } from '@/types/instances';

export interface GetInstancesResponse {
  data: Instance[];
}

export const InstancesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getInstances: builder.query<Array<Instance>, void>({
      query: () => ({
        url: '/clients',
        method: 'GET'
      }),
      transformResponse: (response: GetInstancesResponse) => {
        return response.data;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Instances', id }) as const),
              { type: 'Instances', id: 'LIST' }
            ]
          : [{ type: 'Instances', id: 'LIST' }]
    }),
    addInstance: builder.mutation<Instance, Partial<Instance>>({
      query(body) {
        return {
          url: `/clients`,
          method: 'POST',
          body
        };
      },
      invalidatesTags: [{ type: 'Instances', id: 'LIST' }]
    }),
    updateInstance: builder.mutation<Instance, Partial<Instance>>({
      query(body) {
        return {
          url: `/clients/${body.id}`,
          method: 'PUT',
          body
        };
      },
      invalidatesTags: [{ type: 'Instances', id: 'LIST' }]
    }),
    deleteInstance: builder.mutation<Instance, Partial<Instance>>({
      query(body) {
        return {
          url: `/clients/${body.id}`,
          method: 'DELETE',
          body
        };
      },
      invalidatesTags: [{ type: 'Instances', id: 'LIST' }]
    }),
    connectWhatsapp: builder.mutation<Instance, { code: string }>({
      query(body) {
        return {
          url: `/clients/whatsapp/connect`,
          method: 'POST',
          body
        };
      }
    })
  })
});

export const {
  useGetInstancesQuery,
  useAddInstanceMutation,
  useUpdateInstanceMutation,
  useDeleteInstanceMutation,
  useConnectWhatsappMutation
} = InstancesApi;
