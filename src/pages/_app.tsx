import Navbar from 'components/navbar'
import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'
import Head from 'next/head'
import 'styles/tailwind.css'
import { HiCheckCircle, HiExclamation } from 'react-icons/hi'
import { QueryClientProvider } from 'react-query'
import { queryClient } from 'utils/client'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Bookmarker</title>
        <link rel="icon" type="image/png" href="favicon.png" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <>
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
      </QueryClientProvider>
      <Toaster
        toastOptions={{
          className: 'text-xs',
          success: {
            icon: <HiCheckCircle className="h-5 w-5 text-text-success" />,
          },
          error: {
            icon: <HiExclamation className="h-5 w-5 text-text-error" />,
          },
        }}
      />
    </>
  )
}
