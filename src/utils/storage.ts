const SEARCH_TERM_KEY = 'searchTerm';

export const getSearchTerm = (): string => {
  return localStorage.getItem(SEARCH_TERM_KEY) || '';
};

export const setSearchTerm = (term: string): void => {
  localStorage.setItem(SEARCH_TERM_KEY, term);
};
