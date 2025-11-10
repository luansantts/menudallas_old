import { Box, Flex, useDisclosure } from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { getOpened } from "../../utils/getOpened";
import Swal from "sweetalert2";
import CartModal from "../CartModal/CartModal";
import CartIconButton from "../cart/CartIconButton";

function FooterStore({ data, subdomain, variant = "default" }) {
  const [bag, setBag] = useState([]);
  const [opened, setOpened] = useState(false);
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Adicionar um useEffect para recarregar a sacola quando mudar
  useEffect(() => {
    const b = localStorage.getItem("@menu-digital:" + subdomain + ":bag");

    if (b !== null) {
      setBag(JSON.parse(b));
    } else {
      setBag([]);
    }
  }, [subdomain, isOpen]); // Adiciona isOpen como dependência para recarregar ao abrir

  useEffect(() => {
    setOpened(getOpened(data));
  }, [data]);

  const hasItems = bag !== null && bag.length > 0;
  const isFloating = variant === "floating";

  // Format bag items for CartModal - Garantir que o preço unitário está correto
  const formatCartItems = () => {
    return bag.map((item) => {
      // Calcula o preço unitário corretamente
      const unitPrice = item.valor_total / item.quantidade;
      return {
        id: item.id,
        name: item.descricao,
        price: unitPrice,
        imageUrl: item.foto_destaque || "/placeholder.png",
        qty: item.quantidade,
      };
    });
  };

  // Calculate subtotal
  const calculateSubtotal = () => {
    return bag.reduce((sum, item) => sum + item.valor_total, 0);
  };

  // Handlers for CartModal - Recalculando totais corretamente
  const handleInc = (id) => {
    const updatedBag = bag.map((item) => {
      if (item.id === id) {
        // Incrementa quantidade e recalcula valor_total
        const newQty = item.quantidade + 1;
        const unitPrice = item.valor_total / item.quantidade; // Preço unitário
        return {
          ...item,
          quantidade: newQty,
          valor_total: unitPrice * newQty,
        };
      }
      return item;
    });
    setBag(updatedBag);
    localStorage.setItem(
      "@menu-digital:" + subdomain + ":bag",
      JSON.stringify(updatedBag)
    );
  };

  const handleDec = (id) => {
    const updatedBag = bag
      .map((item) => {
        if (item.id === id && item.quantidade > 1) {
          // Decrementa quantidade e recalcula valor_total
          const newQty = item.quantidade - 1;
          const unitPrice = item.valor_total / item.quantidade; // Preço unitário
          return {
            ...item,
            quantidade: newQty,
            valor_total: unitPrice * newQty,
          };
        }
        return item;
      })
      .filter((item) => item.quantidade > 0); // Remove itens com qty = 0
    setBag(updatedBag);
    localStorage.setItem(
      "@menu-digital:" + subdomain + ":bag",
      JSON.stringify(updatedBag)
    );
  };

  const handleRemove = (id) => {
    const updatedBag = bag.filter((item) => item.id !== id);
    setBag(updatedBag);
    localStorage.setItem(
      "@menu-digital:" + subdomain + ":bag",
      JSON.stringify(updatedBag)
    );
  };

  return (
    <>
      <Box position="relative">
        <CartIconButton
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

            if (hasItems) {
              onOpen();
            }
          }}
          cursor={hasItems ? "pointer" : "default"}
          // Usar tamanho padrão do CartIconButton (44px) para consistência
          // w={isFloating ? ["56px", "62px"] : ["52px", "56px"]}
          // h={isFloating ? ["56px", "62px"] : ["52px", "56px"]}
          // minW={isFloating ? ["56px", "62px"] : ["52px", "56px"]}
          // minH={isFloating ? ["56px", "62px"] : ["52px", "56px"]}
          border="1px solid rgba(15, 23, 42, 0.05)"
          boxShadow={
            isFloating
              ? "0px 18px 42px rgba(15, 23, 42, 0.25)"
              : "0px 12px 26px rgba(49, 72, 122, 0.15)"
          }
          transition="0.2s ease"
          opacity={opened ? 1 : 0.8}
        />
        {bag.length > 0 && (
          <Flex
            top={["-4px", "-6px"]}
            right={["-6px", "-8px"]}
            position="absolute"
            borderRadius="full"
            bg={data?.primary_color || "#FEAD1D"}
            color="white"
            minW="22px"
            h="22px"
            fontSize="12px"
            fontWeight={700}
            alignItems="center"
            justifyContent="center"
            border="2px solid white"
            aria-live="polite"
          >
            {bag.length}
          </Flex>
        )}
      </Box>

      {/* Cart Modal */}
      <CartModal
        isOpen={isOpen}
        onClose={onClose}
        items={formatCartItems()}
        subtotal={calculateSubtotal()}
        discounts={0}
        onInc={handleInc}
        onDec={handleDec}
        onRemove={handleRemove}
        subdomain={subdomain}
      />
    </>
  );
}

export default FooterStore;
