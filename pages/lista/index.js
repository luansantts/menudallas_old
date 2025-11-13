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
import StickyCartBar from "../../components/StickyCartBar/StickyCartBar";
import { useDisclosure } from "@chakra-ui/react";
import CartModal from "../../components/CartModal/CartModal";

function lista({ data, subdomain }) {
  const [loading, setLoading] = useState(true);
  const [refreshSearch, setRefreshSearch] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const {
    isOpen: isCartOpen,
    onOpen: onCartOpen,
    onClose: onCartClose,
  } = useDisclosure();
  const router = useRouter();

  useEffect(() => {
    setLoading(false);

    if (isEmpty(data)) {
      router.push("/");
    }
  }, [data, subdomain]);

  // Load cart items from localStorage
  useEffect(() => {
    const loadCart = () => {
      const bag = localStorage.getItem("@menu-digital:" + subdomain + ":bag");
      if (bag) {
        const items = JSON.parse(bag);
        setCartItems(items);
        // Calculate total
        const total = items.reduce((sum, item) => sum + item.valor_total, 0);
        setCartTotal(total);
      }
    };

    loadCart();
    // Reload cart periodically to keep it updated
    const interval = setInterval(loadCart, 1000);
    return () => clearInterval(interval);
  }, [subdomain]);

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
          </Box>
          <Box className="content-panel page-list" pb="88px">
            <InfoStoreHome type={2} data={data} subdomain={subdomain} />
            <MenuOptionsStore data={data} subdomain={subdomain} />
            <MainProducts
              data={data}
              subdomain={subdomain}
              refreshSearch={refreshSearch}
              setRefreshSearch={setRefreshSearch}
            />
            <ProductsList data={data} />
          </Box>

          {/* Sticky Cart Bar - Only on /lista */}
          {cartItems.length > 0 && (
            <StickyCartBar
              total={cartTotal}
              itemsCount={cartItems.length}
              onOpenCart={onCartOpen}
            />
          )}

          {/* Cart Modal */}
          <CartModal
            isOpen={isCartOpen}
            onClose={onCartClose}
            items={cartItems.map((item, index) => ({
              // id aqui representa o índice da linha no carrinho,
              // garantindo operações por item mesmo com produtos duplicados
              id: index,
              name: item.descricao || item.tag || "Produto",
              price: item.valor_total / item.quantidade,
              imageUrl: item.foto_destaque || "/placeholder.png",
              qty: item.quantidade,
              sabores: item.sabores || [],
              adicional: item.adicional || [],
              total_adicional: item.total_adicional || 0,
              tipo: item.tipo,
              tamanho: item.tamanho,
              data: data,
            }))}
            subtotal={cartTotal}
            discounts={0}
            onInc={(lineIndex) => {
              const updatedBag = cartItems.map((item, idx) => {
                if (idx === lineIndex) {
                  const newQty = item.quantidade + 1;
                  const unitPrice = item.valor_total / item.quantidade;
                  return {
                    ...item,
                    quantidade: newQty,
                    valor_total: unitPrice * newQty,
                  };
                }
                return item;
              });
              setCartItems(updatedBag);
              setCartTotal(
                updatedBag.reduce((sum, item) => sum + item.valor_total, 0)
              );
              localStorage.setItem(
                "@menu-digital:" + subdomain + ":bag",
                JSON.stringify(updatedBag)
              );
            }}
            onDec={(lineIndex) => {
              const updatedBag = cartItems
                .map((item, idx) => {
                  if (idx === lineIndex && item.quantidade > 1) {
                    const newQty = item.quantidade - 1;
                    const unitPrice = item.valor_total / item.quantidade;
                    return {
                      ...item,
                      quantidade: newQty,
                      valor_total: unitPrice * newQty,
                    };
                  }
                  return item;
                })
                .filter((item) => item.quantidade > 0);
              setCartItems(updatedBag);
              setCartTotal(
                updatedBag.reduce((sum, item) => sum + item.valor_total, 0)
              );
              localStorage.setItem(
                "@menu-digital:" + subdomain + ":bag",
                JSON.stringify(updatedBag)
              );
            }}
            onRemove={(lineIndex) => {
              // Remove apenas o item específico clicado (por índice da linha)
              const updatedBag = cartItems.slice();
              if (lineIndex < 0 || lineIndex >= updatedBag.length) return;
              updatedBag.splice(lineIndex, 1);
              setCartItems(updatedBag);
              setCartTotal(
                updatedBag.reduce((sum, item) => sum + item.valor_total, 0)
              );
              localStorage.setItem(
                "@menu-digital:" + subdomain + ":bag",
                JSON.stringify(updatedBag)
              );
            }}
          />
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
