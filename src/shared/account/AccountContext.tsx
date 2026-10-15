import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';
import { accountService, connectionMessage } from './service';
import type { AccountUser, ResourceState } from './types';

const AccountContext = createContext<ResourceState<AccountUser | null>>({ status: `unconfigured`, message: connectionMessage });
export const AccountProvider = ({ children }: PropsWithChildren) => {
  const [state, setState] = useState<ResourceState<AccountUser | null>>({ status: `unconfigured`, message: connectionMessage });
  useEffect(() => accountService.subscribeUser(setState), []);
  return <AccountContext.Provider value={state}>{children}</AccountContext.Provider>;
};
export const useAccount = () => useContext(AccountContext);
