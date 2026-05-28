import type { AppProps } from "next/app"
import { ThemeProvider, CssBaseline } from '@mui/material'
import { theme } from '../components/theme'

export default function MyApp({ Component, pageProps }: AppProps) {
  const activeTheme = theme

  return (
    <>
      <ThemeProvider theme={activeTheme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  )
}
