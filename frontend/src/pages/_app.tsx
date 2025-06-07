import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import type { AppProps } from "next/app";
import '../styles/globals.css';
import {  store } from "../store";
import { Provider } from "react-redux";
import Layout from "../components/Layout";
// import Footer from "../components/footer";
// import { PersistGate } from "redux-persist/integration/react";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
  typography: {
    fontFamily: 'Verdana, Geneva, sans-serif',
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      {/* <PersistGate loading={null} persistor={persistor}> */}
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Layout>
      <Component {...pageProps} />
      {/* <Footer/> */}
      </Layout>
    </ThemeProvider>
    {/* </PersistGate> */}
    </Provider>
  );
}
