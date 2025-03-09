import { useState, useEffect } from 'react';
import { getSearchTerm } from '../utils/storage';

const useLocalSearchTerm = (): [
  string,
  React.Dispatch<React.SetStateAction<string>>,
] => {
  const [term, setTerm] = useState<string>('');

  useEffect(() => {
    const storedTerm = getSearchTerm();
    setTerm(storedTerm);
  }, []);

  return [term, setTerm];
};

export default useLocalSearchTerm;
