import React from "react";
import { Box, Button, HStack, Text, VStack } from "@chakra-ui/react";

const formatBRL = (value = 0) =>
  value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

/**
 * Sticky Cart Bar - Barra fixa mostrando total e botão "Ver Sacola"
 * @param {number} total - Total dos pedidos
 * @param {number} itemsCount - Quantidade de itens no carrinho
 * @param {function} onOpenCart - Função para abrir o modal da sacola
 */
export default function StickyCartBar({ total, itemsCount, onOpenCart }) {
  if (!itemsCount || itemsCount === 0) return null;

  return (
    <Box
      position="fixed"
      left="0"
      right="0"
      bottom="0"
      zIndex={998}
      bg="white"
      borderTopWidth="1px"
      borderTopColor="gray.200"
      boxShadow="0 -8px 24px rgba(0,0,0,0.06)"
      px="16px"
      py="14px"
    >
      <HStack maxW="640px" mx="auto" spacing={4}>
        <VStack align="start" spacing={0} flex="1">
          <Text fontSize="sm" color="gray.500">
            Total dos pedidos
          </Text>
          <HStack spacing={2}>
            <Text fontWeight="bold" fontSize="lg">
              {formatBRL(total)}
            </Text>
            <Text fontSize="sm" color="gray.500">
              / {itemsCount} {itemsCount === 1 ? "item" : "itens"}
            </Text>
          </HStack>
        </VStack>

        <Button
          className="ver-sacola-btn"
          onClick={onOpenCart}
          color="white"
          bg="#CF3F2E"
          _hover={{ bg: "#B53626" }}
          _active={{ bg: "#B53626" }}
          size="lg"
          borderRadius="xl"
          px={6}
          fontSize="14px"
        >
          Ver Sacola
        </Button>
      </HStack>
    </Box>
  );
}
