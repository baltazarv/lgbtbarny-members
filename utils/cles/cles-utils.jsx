import useSWR from 'swr';
import { fetcher } from '../swr-fetch';

const useCles = (id) => {
  const { data, error, isValidating, mutate } = useSWR(`/api/cles/get-cles`, fetcher, {
    revalidateOnMount: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return {
    cles: data,
    isLoading: !error && !data,
    isError: error,
    isValidating,
    mutate,
  };
};

export {
  useCles,
};