import '../styles/skeleton/normalize.css';
import '../styles/skeleton/skeleton.css';
import '../styles/globals.css';
import Head from "next/head";
import React from "react";

function MyApp({ Component, pageProps }) {
  return (
    <Component {...pageProps} >
      <Head>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
    </Component>
  );
}

export default MyApp
