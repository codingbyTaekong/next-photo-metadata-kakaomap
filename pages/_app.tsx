import type { AppProps } from 'next/app';
import GlobalStyle from '../src/styles/globalStyles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { RecoilRoot } from 'recoil';
import { useState } from 'react';
import { Noto_Sans_KR } from 'next/font/google';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
const NotoSansKr = Noto_Sans_KR({ weight: ['400', '500', '700'], subsets: ['latin'], style: ['normal'] });

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <RecoilRoot>
        <style jsx global>
          {`
            :root {
              --fn-sans: ${NotoSansKr.style.fontFamily};
            }
          `}
        </style>
        <GlobalStyle />
        <Component {...pageProps} />
      </RecoilRoot>
    </QueryClientProvider>
  );
}
