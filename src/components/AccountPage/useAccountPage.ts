import { useState } from 'react';
import { useAccount } from '../../shared/account/AccountContext';
import { accountPages, type AccountPageKey } from '../../shared/account/navigation';

const useAccountPage = (page: AccountPageKey) => {
  const account = useAccount();
  const [preview, setPreview] = useState(false);
  return { account, preview, setPreview, page: accountPages[page] };
};
export default useAccountPage;
