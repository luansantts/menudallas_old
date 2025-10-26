import React, { useEffect, useState } from "react";
import { HomeStore } from "../components/HomeStore";
import { HomeEstablishments } from "../components/HomeEstablishments";
import { isEmpty } from "lodash";
import Head from "next/head";
import url from "url";

export default function Home({ data, subdomain }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, [data, subdomain]);

  console.debug(subdomain);

  return (
    <>
      {!isEmpty(data) && subdomain && (
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
            content={
              data && data.primary_color ? data.primary_color : "#1e90ff"
            }
          />
        </Head>
      )}

      {!loading && (
        <>
          {subdomain && !isEmpty(data) ? (
            <HomeStore data={data} subdomain={subdomain} />
          ) : (
            <HomeEstablishments />
          )}
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

  // Se as variáveis de ambiente não estão configuradas, retorna props vazias para desenvolvimento
  if (!subdomain || !baseDomain || !backendUrl) {
    return {
      props: {
        data: {},
        subdomain: "",
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

      const data = await response.json();

      return {
        props: {
          data: data.length > 0 ? data[0] : [],
          subdomain: subdomain,
        },
      };
    } catch (error) {
      console.debug("error API Marcio", error);
      return {
        props: {
          data: {},
          subdomain: "",
        },
      };
    }
  } else {
    return {
      props: {
        data: {},
        subdomain: "",
      },
    };
  }
}
