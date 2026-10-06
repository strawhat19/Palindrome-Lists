import Head from 'expo-router/head';
import usePageMetadata from './usePageMetadata.web';
import type { PageMetadataProps } from './types';
import { pageMetadata, siteMetadata } from '../../shared/landing/metadata';

const PageMetadata = ({ page }: PageMetadataProps) => {
  const metadata = pageMetadata[page];
  const canonical = `${siteMetadata.url}${metadata.path}`;
  usePageMetadata(metadata);
  const structuredData = {
    '@context': `https://schema.org`,
    '@graph': [
      {
        '@type': `WebSite`,
        name: siteMetadata.name,
        url: `${siteMetadata.url}/`,
        '@id': `${siteMetadata.url}/#website`,
      },
      {
        '@type': [`words`, `names`, `phrases`].includes(page) ? `CollectionPage` : `WebPage`,
        url: canonical,
        name: metadata.title,
        '@id': `${canonical}#page`,
        inLanguage: `en`,
        description: metadata.description,
        isPartOf: { '@id': `${siteMetadata.url}/#website` },
      },
      ...(page === `home` ? [] : [{
        '@type': `BreadcrumbList`,
        itemListElement: [
          { '@type': `ListItem`, position: 1, name: `Home`, item: `${siteMetadata.url}/` },
          { '@type': `ListItem`, position: 2, name: metadata.label, item: canonical },
        ],
      }]),
    ],
  };

  return (
    <Head>
      <title>{metadata.title}</title>
      <meta name='description' content={metadata.description} />
      <meta name='robots' content={metadata.noIndex ? `noindex, follow` : `index, follow`} />
      {page !== `not-found` && <link rel='canonical' href={canonical} />}
      <meta property='og:url' content={canonical} />
      <meta property='og:type' content='website' />
      <meta property='og:locale' content='en_US' />
      <meta property='og:title' content={metadata.title} />
      <meta property='og:site_name' content={siteMetadata.name} />
      <meta property='og:description' content={metadata.description} />
      <meta name='twitter:card' content='summary' />
      <meta name='twitter:title' content={metadata.title} />
      <meta name='twitter:description' content={metadata.description} />
      {!metadata.noIndex && (
        <script id={`page-schema-${page}`} type='application/ld+json'>
          {JSON.stringify(structuredData).replace(/</g, `\\u003c`)}
        </script>
      )}
    </Head>
  );
};

export default PageMetadata;
