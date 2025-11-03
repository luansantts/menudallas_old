import Head from "next/head";
import { Providers } from "../providers";
import "../styles/globals.css";
import { useEffect } from "react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    localStorage.removeItem("@menu-digital:term");
  }, []);

  return (
    <div className={poppins.variable}>
      <Providers>
        <Component {...pageProps} />
      </Providers>
    </div>
  );
}

export default MyApp;
