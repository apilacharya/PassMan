import * as React from 'react';
import { AppProps } from 'next/app';
import NProgress from 'nprogress';
import { Router } from 'next/router';
import { SessionProvider } from 'next-auth/react';
import { ChakraProvider } from '@chakra-ui/react';
import customTheme from '@/theme';

import 'src/styles/global.css';
import 'src/styles/nprogress.css';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';

export default function App(props: AppProps) {
  const [queryClient] = React.useState(() => new QueryClient());
  const { Component, pageProps } = props;

  React.useEffect(() => {
    const handleRouteStart = () => NProgress.start();
    const handleRouteDone = () => NProgress.done();

    Router.events.on('routeChangeStart', handleRouteStart);
    Router.events.on('routeChangeComplete', handleRouteDone);
    Router.events.on('routeChangeError', handleRouteDone);

    return () => {
      Router.events.off('routeChangeStart', handleRouteStart);
      Router.events.off('routeChangeComplete', handleRouteDone);
      Router.events.off('routeChangeError', handleRouteDone);
    };
  }, []);

  return (
    <SessionProvider session={pageProps.session}>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <ChakraProvider theme={customTheme}>
            <Component {...pageProps} />
          </ChakraProvider>
        </Hydrate>
      </QueryClientProvider>
    </SessionProvider>
  );
}
