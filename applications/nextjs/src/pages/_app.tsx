import { ThemeProvider } from '@material-ui/styles';
import { AuthProvider } from '../contexts/auth.context';
import { theme } from '../themes';
import { CssBaseline } from '@material-ui/core';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <AuthProvider onError={err => router.replace('/auth/login')}>
        <Component {...pageProps} />
      </AuthProvider>
    </ThemeProvider>
  )
}
