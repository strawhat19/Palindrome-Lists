import type { PropsWithChildren } from 'react';
import { themeBootstrapScript } from '../src/shared/themeContext/themeInitialization';

const RootHtml = ({ children }: PropsWithChildren) => (
  <html lang='en'>
    <head>
      <meta charSet='utf-8' />
      <meta name='theme-color' content='#FFFBFD' />
      <script id='theme-preference-bootstrap' dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <meta name='application-name' content='Palindrome Lists' />
      <link rel='icon' href='/favicon.svg' type='image/svg+xml' />
      <link rel='manifest' href='/manifest.webmanifest' />
      <noscript><style>{`html body { visibility: visible !important; }`}</style></noscript>
    </head>
    <body>{children}</body>
  </html>
);

export default RootHtml;
