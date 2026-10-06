import type { PropsWithChildren } from 'react';

const RootHtml = ({ children }: PropsWithChildren) => (
  <html lang='en'>
    <head>
      <meta charSet='utf-8' />
      <meta name='theme-color' content='#FFFBFD' />
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <meta name='application-name' content='Palindrome Lists' />
      <link rel='icon' href='/favicon.svg' type='image/svg+xml' />
      <link rel='manifest' href='/manifest.webmanifest' />
    </head>
    <body>{children}</body>
  </html>
);

export default RootHtml;
