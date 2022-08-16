import Navbar from 'components/navbar'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import 'styles/tailwind.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Bookmarker</title>
        <link rel="icon" type="image/png" href="favicon.png" />
      </Head>
      <Navbar />
      <div
        className="h-screen px-4"
        style={{
          paddingTop: Navbar.HEIGHT + 16, // additional 16px for the gap between the navbar and the content
        }}
      >
        <Component {...pageProps} />
      </div>
    </>
  )
}
