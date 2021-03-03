import useSWR from 'swr';
import moment from 'moment';
import { fetcher } from '../swr-fetch';
// data
import { dbFields } from '../../data/members/airtable/airtable-fields';

const useLawNotes = (id) => {
  const { data, error, isValidating, mutate } = useSWR(`/api/law-notes/get-law-notes`, fetcher, {
    revalidateOnMount: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return {
    lawNotes: data,
    isLoading: !error && !data,
    isError: error,
    isValidating,
    mutate,
  };
};

const getLatest = (issues) => {
  const latest = [...issues].reduce((acc, cur) => {
    if (moment(cur.fields[dbFields.lawNotes.issues.date], 'YYYY-M-D').isAfter(moment(acc.fields.date, 'YYYY-M-D'))) {
      return cur;
    }
    return acc;
  });
  return latest;
};

const getSampleLawNotes = (lawNotes) => {
  if (lawNotes) {
    const samples = [...lawNotes].reduce((acc, cur) => {
      if (cur.fields[dbFields.lawNotes.issues.sample]) acc.push(cur);
      return acc;
    }, []);
    if (samples.length > 1) return getLatest(samples);
    return samples[0];
  }
  return null;
};

const getLawNotesPdf = (issue) => {
  if (issue) {
    return issue.fields[dbFields.lawNotes.issues.pdf][0].url;
  }
  return null;
};

export {
  useLawNotes,
  getSampleLawNotes,
  getLatest,
  getLawNotesPdf,
};