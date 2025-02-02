export interface CardData {
  id: string;
  title: string;
  description: string;
  image?: string;
}

interface NasaItemData {
  title: string;
  description?: string;
  nasa_id: string;
}

interface NasaItemLink {
  href: string;
  rel: string;
  render: string;
}

interface NasaItem {
  data: NasaItemData[];
  links?: NasaItemLink[];
}

interface NasaResponse {
  collection: {
    items: NasaItem[];
  };
}

/**
 * Custom error class that includes an HTTP status code.
 */
export class ApiError extends Error {
  public code: number;

  constructor(message: string, code: number) {
    super(message);
    this.code = code;
    this.name = 'ApiError';
  }
}

/**
 * Fetch NASA images using the NASA Image and Video Library API.
 * @param searchTerm The term to search for. If empty, fetches default images.
 * @returns A promise that resolves to an array of CardData.
 */
export const fetchNasaImages = async (
  searchTerm: string
): Promise<CardData[]> => {
  let url = 'https://images-api.nasa.gov/search?media_type=image';
  if (searchTerm.trim()) {
    url += `&q=${encodeURIComponent(searchTerm.trim())}`;
  }

  console.log('🌍 Fetching from URL:', url);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      // Throw an ApiError with a code property
      throw new ApiError(
        `API Error: ${response.status} ${response.statusText}`,
        response.status
      );
    }

    const data: NasaResponse = await response.json();

    if (!data?.collection?.items) {
      throw new Error('API returned an unexpected response format.');
    }

    const items: CardData[] = data.collection.items
      .filter((item) => item.data && item.data.length > 0)
      .map((item: NasaItem) => {
        const dataItem = item.data[0];
        return {
          id: dataItem.nasa_id,
          title: dataItem.title,
          description: dataItem.description || 'No description available',
          image: item.links?.[0]?.href,
        };
      });

    if (items.length === 0) {
      throw new Error('No results found for the given search term.');
    }

    console.log('[NASA API] Successfully fetched items:', items);
    return items;
  } catch (error: unknown) {
    if (error instanceof TypeError) {
      console.error('Network error:', error);
      throw new Error(
        '⚠️ Failed to connect to the NASA API. Please check your internet connection.'
      );
    }
    console.error('[NASA API] Fetch error:', error);
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error(
        'An unexpected error occurred while fetching NASA images.'
      );
    }
  }
};
