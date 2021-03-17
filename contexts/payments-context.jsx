// TODO: delete b/c cannot seem to have two context
import { createContext, useState } from 'react';

const PaymentsContext = createContext();

const PaymentsProvider = ({ children }) => {
  const [subscriptions, setSubscriptions] = useState(null);
  const [activeSubscription, setActiveSubscription] = useState(null);

  return (<PaymentsContext.Provider value={{
    subscriptions, setSubscriptions,
    activeSubscription, setActiveSubscription,
  }}>{children}</PaymentsContext.Provider>);
};

export { PaymentsContext, PaymentsProvider };