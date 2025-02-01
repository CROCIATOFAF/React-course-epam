export interface CardData {
  id: string;
  title: string;
  description: string;
  image?: string;
}

interface NasaItemData {
  title: string;
  description: string;
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
 * Fetch NASA images using the NASA Image and Video Library API.
 * @param searchTerm The term to search for. If empty, fetches default images.
 * @returns A promise that resolves to an array of CardData.
 */
export const fetchNasaImages = async (
  searchTerm: string
): Promise<CardData[]> => {
  let url = 'https://images-api.nasa.gov/search?media_type=image';
  if (searchTerm) {
    url += `&q=${encodeURIComponent(searchTerm)}`;
  }
  console.log('Fetching from URL:', url);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  const data: NasaResponse = await response.json();
  console.log('Raw NASA API data:', data);

  const items: CardData[] = data.collection.items.map((item: NasaItem) => {
    const dataItem = item.data[0];
    return {
      id: dataItem.nasa_id,
      title: dataItem.title,
      description: dataItem.description || 'No description available',
      image: item.links && item.links[0] ? item.links[0].href : undefined,
    };
  });
  return items;
};
