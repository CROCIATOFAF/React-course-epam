const SEARCH_TERM_KEY = 'searchTerm';

export const getSearchTerm = (): string => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(SEARCH_TERM_KEY) || '';
  }
  return '';
};

export const setSearchTerm = (term: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(SEARCH_TERM_KEY, term);
  }
};
