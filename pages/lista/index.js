import React, { useEffect, useState } from "react";

import Navbar from "../../components/Navbar/Navbar";
import HeaderHomeStore from "../../components/HeaderHomeStore/HeaderHomeStore";
import InfoStoreHome from "../../components/InfoStoreHome/InfoStoreHome";
import Head from "next/head";
import { MenuOptionsStore } from "../../components/MenuOptionsStore";
import { MainProducts } from "../../components/MainProducts";
import { ProductsList } from "../../components/ProductsList";
import { Box } from "@chakra-ui/react";
import url from "url";
import { isEmpty } from "lodash";
import { useRouter } from "next/router";

function lista({ data, subdomain }) {
  const [loading, setLoading] = useState(true);
  const [refreshSearch, setRefreshSearch] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setLoading(false);

    if (isEmpty(data)) {
      router.push("/");
    }
  }, [data, subdomain]);

  if (isEmpty(data)) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{data?.nome}</title>
        <link rel="shortcut icon" href={data?.logo_home} />
        <meta property="og:title" content={data?.nome} />
        <meta
          property="og:description"
          content={data?.frase_home || data?.nome}
        />
        <meta property="og:image" content={data?.logo_home} />
        <meta name="description" content={data?.frase_home || data?.nome} />
        <meta name="twitter:title" content={data?.nome} />
        <meta
          name="twitter:description"
          content={data?.frase_home || data?.nome}
        />
        <meta name="twitter:image" content={data?.logo_home} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="theme-color"
          content={data && data.primary_color ? data.primary_color : "#1e90ff"}
        />
      </Head>

      {!loading && (
        <>
          <Navbar
            isHome={false}
            hasSearch={false}
            setRefreshSearch={setRefreshSearch}
            data={data}
            subdomain={subdomain}
            variant="storefront"
          />

          <Box id="header">
            <HeaderHomeStore data={data} />
            <InfoStoreHome
              type={2}
              data={data}
              subdomain={subdomain}
            />
            <MenuOptionsStore data={data} subdomain={subdomain} />
          </Box>
          <MainProducts
            data={data}
            subdomain={subdomain}
            refreshSearch={refreshSearch}
            setRefreshSearch={setRefreshSearch}
          />
          <ProductsList data={data} />
        </>
      )}
    </>
  );
}

export async function getServerSideProps(context) {
  const host =
    context.req.headers["x-forwarded-host"] || context.req.headers.host;
  const subdomain = process.env.NEXT_PUBLIC_COMPANY_SUBDOMAIN;
  const baseDomain = process.env.NEXT_PUBLIC_BASE_URL_NAME_BASE_DOMAIN;
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  // Se as variáveis de ambiente não estão configuradas, retorna dados mockados para desenvolvimento
  if (!subdomain || !baseDomain || !backendUrl) {
    return {
      props: {
        data: {
          nome: "Menu Dallas - Desenvolvimento",
          frase_home: "Sistema de delivery em desenvolvimento",
          primary_color: "#1e90ff",
          logo_home: "/img/logo.png",
          endereco: "Rua Exemplo",
          numero: "123",
          bairro: "Centro",
          cidade: "São Paulo",
          estado: "SP",
          valor_minimo: 20.0,
          frase_tempo_buscar: "30-45 min",
          frase_tempo_delivery: "45-60 min",
        },
        subdomain: "dev",
      },
    };
  }

  if (subdomain != baseDomain) {
    try {
      const username = "testserver";
      const password = "testserver";

      const headers = new Headers({
        Authorization: `Basic ${btoa(username + ":" + password)}`,
      });

      const response = await fetch(`${backendUrl}home/${subdomain}`, {
        method: "GET",
        headers: headers,
      });
      const rawData = await response.json();

      // Função para limpar valores undefined do objeto
      const cleanUndefined = (obj) => {
        if (!obj || typeof obj !== "object") return obj;

        Object.keys(obj).forEach((key) => {
          if (obj[key] === undefined) {
            obj[key] = null;
          } else if (typeof obj[key] === "object" && obj[key] !== null) {
            cleanUndefined(obj[key]);
          }
        });

        return obj;
      };

      const cleanedData =
        rawData && rawData[0] ? cleanUndefined(rawData[0]) : {};

      return {
        props: {
          data: cleanedData,
          subdomain,
        },
      };
    } catch (error) {
      console.error("Error fetching data:", error);
      return {
        props: {
          data: {},
          subdomain: "",
        },
      };
    }
  } else {
    return {
      redirect: {
        destination: baseUrl || "/",
        permanent: false,
      },
    };
  }
}

export default lista;
