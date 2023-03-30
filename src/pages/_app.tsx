import '@/styles/globals.css'
import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
import { brandTheme } from '../const/theme'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={brandTheme}>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}
