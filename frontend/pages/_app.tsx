import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { useEffect } from "react";
import { loadTokenFromStorage } from "../store/slices/authSlice";
import Layout from "../components/Layout";
import PageTransition from "../components/PageTransition";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    store.dispatch(loadTokenFromStorage());
  }, []);

  return (
    <Provider store={store}>
      <Layout>
        <PageTransition>
          <Component {...pageProps} />
        </PageTransition>
      </Layout>
    </Provider>
  );
}
