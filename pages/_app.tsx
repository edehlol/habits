import { AppProps } from "next/app";
import Head from "next/head";
import { MantineProvider } from "@mantine/core";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Database } from "../types/supabase";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";

export default function App(props: AppProps) {
  const { Component, pageProps } = props;
  // Create a new supabase browser client on every first render.
  const [supabaseClient] = useState(() =>
    createBrowserSupabaseClient<Database>()
  );
  const [queryClient] = useState(
    () =>
      new QueryClient({
        // do not refetch on window focus
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <>
      <Head>
        <title>Page title</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <SessionContextProvider
            supabaseClient={supabaseClient}
            initialSession={pageProps.initialSession}
          >
            <MantineProvider
              withGlobalStyles
              withNormalizeCSS
              theme={{
                /** Put your mantine theme override here */
                colorScheme: "light",
              }}
            >
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </MantineProvider>
          </SessionContextProvider>
        </Hydrate>
      </QueryClientProvider>
    </>
  );
}
