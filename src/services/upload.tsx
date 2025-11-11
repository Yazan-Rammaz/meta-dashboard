import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import axios, { AxiosError } from 'axios';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { setUploadProgress } from '@/features/upload/uploadSlice';
const baseQuery = fetchBaseQuery({
  baseUrl: '--your base url here--'
  //{...other configurations here}
});

const myApi = createApi({
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    upload: builder.mutation({
      queryFn: async ({ url, data }, api) => {
        try {
          const result = await axios.post(url, data, {
            //...other options like headers here
            onUploadProgress: (upload) => {
              //Set the progress value to show the progress bar
              const uploadloadProgress = upload.total
                ? Math.round((100 * upload.loaded) / upload.total)
                : 0;
              api.dispatch(
                setUploadProgress({ name: url, progress: uploadloadProgress })
              );
            }
          });
          return { data: result.data };
        } catch (axiosError) {
          const err: AxiosError = axiosError as AxiosError;
          return {
            error: {
              status: err.response?.status,
              data: err.response?.data
            } as FetchBaseQueryError
          };
        }
      }
    })
  })
});

export default myApi;

export const { useUploadMutation } = myApi;

//setUploadProgress is just a function dispatching an action with the upload
//progress value as a payload, because i had my value being kept in the store //but your case could be different here i Had something like this
/*
    import { createSlice } from '@reduxjs/toolkit'
 
    const initialState = {
      uploadProgress: 0
    }
 
    export const globalSlice = createSlice({
      name: 'globalSlice',
      initialState,
      reducers: {
        setUploadProgress: (state, action) => {
          return {
            ...state,
            uploadProgress: action.payload
          }
        }
      },
    })
 
    export const { 
      setUploadProgress
    } = globalSlice.actions;
 
    export default globalSlice.reducer;
*/
