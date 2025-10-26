import { Box, Flex } from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { getOpened } from "../../utils/getOpened";
import Swal from "sweetalert2";

function FooterStore({ data, subdomain, variant = "default" }) {
  const [bag, setBag] = useState([]);
  const [opened, setOpened] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const b = localStorage.getItem("@menu-digital:" + subdomain + ":bag");

    if (b !== null) {
      setBag(JSON.parse(b));

    }
  }, [subdomain]);

  useEffect(() => {
    setOpened(getOpened(data));
  }, [data]);

  const hasItems = bag !== null && bag.length > 0;
  const isFloating = variant === "floating";

  return (
    <Flex
      onClick={() => {
        if (!opened) {
          return Swal.fire({
            title: "Loja fechada",
            text: "Desculpe, a loja não está aberta no momento. Tente novamente mais tarde.",
            icon: "warning",
            confirmButtonColor: data?.primary_color || "#3085d6",
            confirmButtonText: "OK",
          });
        }

        return hasItems ? router.push("/meu-pedido") : false;
      }}
      cursor={hasItems ? "pointer" : "default"}
      alignItems="center"
      justifyContent="center"
    >
      <Box position="relative">
        <Flex
          alignItems="center"
          justifyContent="center"
          w={isFloating ? ["56px", "62px"] : ["52px", "56px"]}
          h={isFloating ? ["56px", "62px"] : ["52px", "56px"]}
          borderRadius="full"
          bg="white"
          border="1px solid rgba(15, 23, 42, 0.05)"
          boxShadow={
            isFloating
              ? "0px 18px 42px rgba(15, 23, 42, 0.25)"
              : "0px 12px 26px rgba(49, 72, 122, 0.15)"
          }
          transition="0.2s ease"
          opacity={opened ? 1 : 0.8}
        >
          <Image
            src="/img/bag-icon.svg"
            width={26}
            height={26}
            objectFit="contain"
            alt="Sacola de pedidos"
          />
        </Flex>
        <Flex
          top={["-4px", "-6px"]}
          right={["-6px", "-8px"]}
          position="absolute"
          borderRadius="full"
          bg={hasItems ? data?.primary_color || "#FEAD1D" : "#C5CAD8"}
          color="white"
          minW="22px"
          h="22px"
          fontSize="12px"
          fontWeight={700}
          alignItems="center"
          justifyContent="center"
          border="2px solid white"
        >
          {bag.length}
        </Flex>
      </Box>
    </Flex>
  );
}

export default FooterStore;
