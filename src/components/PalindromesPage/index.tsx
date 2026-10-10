import LandingPage from '../LandingPage';
import { LandingProvider } from '../../shared/landing/LandingContext';
import { collectionPages, type CollectionPageKey } from '../../shared/landing/collectionPages';

type PalindromesPageProps = { page?: CollectionPageKey };

const PalindromesPage = ({ page = `palindromes` }: PalindromesPageProps) => (
  <LandingProvider key={page} initialCategory={collectionPages[page].category}>
    <LandingPage collectionOnly collectionPage={page} />
  </LandingProvider>
);

export default PalindromesPage;
