import moment from 'moment';

export const getActiveSubscription = (subscriptions) => {
  if (subscriptions && subscriptions.length > 0) {
    if (subscriptions.length > 1) {
      const activeSubs = [...subscriptions].reduce((acc, cur) => {
        if (cur.status === 'active') acc.push(cur);
        // console.log(cur.id, cur.status, cur.created, moment.unix(cur.created).format('MMMM Do, YYYY, h:mm:ss a'));
        return acc;
      }, []);
      // if there are more than one active subscription (rare)
      if (activeSubs?.length && activeSubs.length > 1) {
        const latestSub = [...activeSubs].reduce((acc, cur) => {
          if (moment.unix(cur.created).isAfter(moment.unix(acc.created))) {
            return cur;
          } else {
            return acc;
          }
        });
        return latestSub;
      } else {
        return null; // []
      }
    } else {
      return subscriptions[0];
    }
  }
  return null;
};