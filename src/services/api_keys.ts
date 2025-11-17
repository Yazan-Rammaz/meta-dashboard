import { api } from '@/services/auth';
import { ApiKey, ApiKeyCreationRequest } from '@/types/api_keys';

export interface GetApiKeysResponse {
  success: boolean;
  data: ApiKey[];
  message: string;
}

export interface AddApiKeyResponse {
  success: boolean;
  data: ApiKey;
  message: string;
}

export const ApiKeysApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getApiKeys: builder.query<ApiKey[], string>({
      query: (clientId) => ({
        url: `/api-keys?client_id=${clientId}`,
        method: 'GET'
      }),
      transformResponse: (response: GetApiKeysResponse) => {
        return response.data;
      },
      providesTags: (result, error, clientId) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'ApiKeys', id }) as const),
              { type: 'ApiKeys', id: 'LIST', clientId }
            ]
          : [{ type: 'ApiKeys', id: 'LIST', clientId }]
    }),
    addApiKey: builder.mutation<AddApiKeyResponse, ApiKeyCreationRequest>({
      query(body) {
        return {
          url: `/api-keys`,
          method: 'POST',
          body
        };
      },
      invalidatesTags: (result, error, { client_id }) => [
        { type: 'ApiKeys', id: 'LIST', clientId: client_id }
      ]
    }),
    updateApiKey: builder.mutation<ApiKey, Partial<ApiKey>>({
      query(body) {
        return {
          url: `/api-keys/${body.id}`,
          method: 'PUT',
          body
        };
      },
      invalidatesTags: (result, error, { client_id }) => [
        { type: 'ApiKeys', id: result?.id, clientId: client_id }
      ]
    }),
    revokeApiKey: builder.mutation<void, { id: string; client_id: string }>({
      query({ id }) {
        return {
          url: `/api-keys/${id}`,
          method: 'DELETE'
        };
      },
      invalidatesTags: (result, error, { client_id }) => [
        { type: 'ApiKeys', id: 'LIST', clientId: client_id }
      ]
    })
  })
});

export const {
  useGetApiKeysQuery,
  useAddApiKeyMutation,
  useUpdateApiKeyMutation,
  useRevokeApiKeyMutation
} = ApiKeysApi;
