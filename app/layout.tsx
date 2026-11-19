import type { Metadata } from 'next';
import '@fontsource-variable/manrope';
import '@fontsource-variable/space-grotesk';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import './styles.css';

export const metadata: Metadata = {
  title: {
    default: 'Ashish Shah — AI & Systems Engineer',
    template: '%s | Ashish Shah',
  },
  description:
    'Ashish Kumar Shah, a computer engineering student in Nepal. Projects and writing on applied AI, multi-agent systems, and software reliability.',
  icons: { icon: '/mark.svg' },
};
const themeScript = `try {var t=localStorage.getItem('portfolio-theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t;else if(matchMedia('(prefers-color-scheme: dark)').matches)document.documentElement.dataset.theme='dark'} catch(e){}`;
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
