import { useEffect } from 'react';
import type { PageSeo } from '../../shared/landing/metadata';
import { registerPwa } from '../../shared/landing/registerPwa';

const usePageMetadata = (metadata: PageSeo) => {
  useEffect(() => {
    // Keep local-development tab titles in sync as well as the static Head output.
    document.title = metadata.title;
    registerPwa();
  }, [metadata.title]);
};

export default usePageMetadata;
