import { api } from '@/services/auth';
import { Language } from '@/models/languages';

export interface GetLanguagesResponse {
  data: Language[];
}

export const LanguagesApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getlanguages: builder.query<Array<Language>, void>({
      query: () => ({
        url: '/languages/all_languages',
        method: 'GET'
      }),
      transformResponse: (response: GetLanguagesResponse) => {
        return response.data;
      },
      providesTags: (result) =>
        // is result available?
        result
          ? [
              ...result.map(({ id }) => ({
                type: 'Languages' as const,
                id
              })),
              { type: 'Languages', id: 'LIST' }
            ]
          : [{ type: 'Languages', id: 'LIST' }]
    }),
    addLanguage: builder.mutation<Language, Partial<Language>>({
      query(body) {
        return {
          url: `/languages/create`,
          method: 'POST',
          body
        };
      },
      invalidatesTags: [{ type: 'Languages', id: 'LIST' }]
    }),
    updateLanguage: builder.mutation<Language, Partial<Language>>({
      query(body) {
        return {
          url: `/languages/update/${body.language_code}`,
          method: 'PUT',
          body
        };
      },
      invalidatesTags: [{ type: 'Languages', id: 'LIST' }]
    }),
    deleteLanguage: builder.mutation<Language, Partial<Language>>({
      query(body) {
        return {
          url: `/languages/destroy/${body.language_code}`,
          method: 'DELETE',
          body
        };
      },
      invalidatesTags: [{ type: 'Languages', id: 'LIST' }]
    })
  })
});

export const {
  useDeleteLanguageMutation,
  useGetlanguagesQuery,
  useAddLanguageMutation,
  useUpdateLanguageMutation
} = LanguagesApi;
