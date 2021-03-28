import useSWR from 'swr';
import { fetcher } from '../swr-fetch';

const useCles = (id) => {
  const { data, error, isValidating, mutate } = useSWR(`/api/members/cles/get-cles`, fetcher, {
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

const useCleCerts = (id) => {
  const { data, error, isValidating, mutate } = useSWR(`/api/members/cles/get-cle-certs`, fetcher, {
    revalidateOnMount: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return {
    certs: data,
    isLoading: !error && !data,
    isError: error,
    isValidating,
    mutate,
  };
};

export {
  useCles,
  useCleCerts,
};