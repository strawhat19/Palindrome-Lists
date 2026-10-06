import { Redirect, useLocalSearchParams } from 'expo-router';
import NotFoundPage from '../NotFoundPage';
import PageMetadata from '../PageMetadata';
import { landingLinks, routeAliases } from '../../shared/routes';

const RouteAlias = () => {
  const params = useLocalSearchParams<{ alias?: string | string[] }>();
  const alias = Array.isArray(params.alias) ? params.alias[0] : params.alias;
  const target = alias && Object.hasOwn(routeAliases, alias) ? routeAliases[alias] : undefined;

  if (!target) return <NotFoundPage />;

  return (
    <>
      <PageMetadata page={target} />
      <Redirect href={landingLinks[target]} />
    </>
  );
};

export default RouteAlias;
