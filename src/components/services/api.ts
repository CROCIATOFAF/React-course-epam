import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CardData } from './nasaApi';

export interface NasaItemData {
  title: string;
  description?: string;
  nasa_id: string;
}

export interface NasaItemLink {
  href: string;
  rel: string;
  render: string;
}

export interface NasaItem {
  data: NasaItemData[];
  links?: NasaItemLink[];
}

export interface NasaResponse {
  collection: {
    items: NasaItem[];
  };
}

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
    fetchNasaImages: builder.query<CardData[], string>({
      query: (searchTerm: string) => {
        let url = '/search?media_type=image';
        if (searchTerm.trim()) {
          url += `&q=${encodeURIComponent(searchTerm.trim())}`;
        }
        return url;
      },
      transformResponse: (response: NasaResponse) => {
        return response.collection.items
          .filter((item) => item.data && item.data.length > 0)
          .map((item) => {
            const dataItem = item.data[0];
            return {
              id: dataItem.nasa_id,
              title: dataItem.title,
              description: dataItem.description || 'No description available',
              image: item.links?.[0]?.href,
            };
          });
      },
    }),
    fetchDetail: builder.query<DetailResponse, string>({
      query: (id: string) => `/search?nasa_id=${id}`,
    }),
  }),
});

export const { useFetchNasaImagesQuery, useFetchDetailQuery } = api;
