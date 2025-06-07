import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import type { AppProps } from "next/app";
import '../styles/globals.css';
import { store } from "../store";
import { Provider } from "react-redux";
import Layout from "../components/Layout";
import 'normalize.css';
import '@fontsource/roboto'; // 👈 Web-safe consistent font

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
  typography: {
    fontFamily: 'Roboto, sans-serif', // 👈 consistent on all OSes
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </Provider>
  );
}
