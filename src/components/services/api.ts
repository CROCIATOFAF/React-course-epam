import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CardData } from './nasaApi';

export interface DetailResponse {
  collection: {
    items: {
      data: {
        nasa_id: string;
        title: string;
        description?: string;
      }[];
      links?: {
        href: string;
        rel: string;
        render: string;
      }[];
    }[];
  };
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://images-api.nasa.gov' }),
  endpoints: (builder) => ({
    fetchNasaImages: builder.query<{ items: CardData[] }, string>({
      query: (searchTerm: string) => {
        let url = '/search?media_type=image';
        if (searchTerm.trim()) {
          url += `&q=${encodeURIComponent(searchTerm.trim())}`;
        }
        return url;
      },
    }),
    fetchDetail: builder.query<DetailResponse, string>({
      query: (id: string) => `/search?nasa_id=${id}`,
    }),
  }),
});

export const { useFetchNasaImagesQuery, useFetchDetailQuery } = api;
