import React from "react";
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerCloseButton,
  DrawerBody,
  DrawerFooter,
  Box,
  HStack,
  VStack,
  Text,
  IconButton,
  Image,
  Divider,
  Button,
  useDisclosure,
  Flex,
} from "@chakra-ui/react";
import { FiChevronLeft, FiChevronRight, FiTrash2 } from "react-icons/fi";
import { useRouter } from "next/router";
import CheckoutModal from "../CheckoutModal/CheckoutModal";
import SuccessModal from "../SuccessModal/SuccessModal";

const SITE_YELLOW = "#F59E0B"; // cor primária do site
const SITE_YELLOW_DARK = "#E8A52D";

/**
 * PROPS:
 * isOpen, onClose, items, subtotal, discounts, onInc, onDec, onRemove
 */
export default function CartModal({
  isOpen,
  onClose,
  items = [],
  subtotal = 0,
  discounts = 0,
  onInc,
  onDec,
  onRemove,
  subdomain,
}) {
  const router = useRouter();
  const checkoutModal = useDisclosure();
  const successModal = useDisclosure();

  // Helpers para parse e formatação de valores
  const parseBRL = (s) => {
    if (typeof s === "number") return s;
    // aceita "R$ 35,00" ou "35,00"
    return (
      Number(
        String(s)
          .replace(/[^\d,.-]/g, "") // remove R$, espaços etc
          .replace(".", "") // milhar
          .replace(",", ".") // decimal
      ) || 0
    );
  };

  const formatBRL = (v) =>
    (Number(v) || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  // Derived totals (sempre a partir do estado atual do carrinho)
  const derivedSubtotal = items.reduce((acc, it) => {
    const unit = parseBRL(it.price ?? it.unitPrice ?? it.valor);
    const qty = Number(it.qty) || 1;
    return acc + unit * qty;
  }, 0);
  const derivedDiscounts = 0;
  const derivedTotal = derivedSubtotal - derivedDiscounts;

  const goCheckout = () => {
    checkoutModal.onOpen();
  };

  return (
    <>
      <Drawer placement="right" isOpen={isOpen} onClose={onClose}>
        <DrawerOverlay bg="blackAlpha.400" />
        <DrawerContent
          // largura menor, igual ao mock
          maxW={{ base: "88vw", sm: "420px" }}
          w="100%"
          borderLeftRadius="2xl"
          boxShadow="xl"
          className="cart-modal"
        >
          <DrawerCloseButton top="22px" right="22px" size="lg" />
          <DrawerHeader fontSize="xl" fontWeight="700" px="6" py="4">
            Sacola
          </DrawerHeader>

          <DrawerBody overflowY="auto" px={6} pt={2} pb={0}>
            <VStack align="stretch" spacing={4}>
              {items.map((item) => {
                const unit = parseBRL(
                  item.price ?? item.unitPrice ?? item.valor
                );
                const qty = Number(item.qty) || 1;
                const lineTotal = unit * qty; // Total da linha (preço × quantidade)

                return (
                  <HStack
                    key={item.id}
                    align="center"
                    spacing={3}
                    className="cart-item"
                    flexWrap="nowrap"
                    px="2"
                    py="2"
                    rounded="md"
                  >
                    {/* thumb menor */}
                    <Box
                      className="thumb"
                      bg="gray.50"
                      rounded="xl"
                      borderWidth="1px"
                      borderColor="gray.100"
                      overflow="hidden"
                      w="64px"
                      h="64px"
                      flex="0 0 64px"
                    >
                      <Image
                        src={item.imageUrl || "/placeholder.png"}
                        alt={item.name}
                        w="100%"
                        h="100%"
                        objectFit="cover"
                      />
                    </Box>

                    <VStack align="start" spacing={2} flex="1" minW={0}>
                      {/* Nome do produto: fontSize menor e mais fino */}
                      <Text
                        className="cart-item-title title"
                        fontSize="sm"
                        fontWeight="500"
                        lineHeight="short"
                        noOfLines={1}
                        wordBreak="break-word"
                        color="gray.800"
                      >
                        {item.name}
                      </Text>

                      <HStack justify="space-between" w="full">
                        {/* Total da linha: preço × quantidade */}
                        <Text
                          className="price-pill"
                          fontWeight="700"
                          lineHeight="1.2"
                        >
                          {formatBRL(lineTotal)}
                        </Text>

                        <HStack spacing={2} className="qty">
                          {/* stepper menor */}
                          <IconButton
                            aria-label="Diminuir"
                            icon={<FiChevronLeft />}
                            size="sm"
                            rounded="xl"
                            variant="outline"
                            onClick={() => onDec?.(item.id)}
                          />
                          {/* Quantidade: fontSize: "16px" */}
                          <Text fontSize="16px" w="18px" textAlign="center">
                            {qty}
                          </Text>
                          <IconButton
                            aria-label="Aumentar"
                            icon={<FiChevronRight />}
                            size="sm"
                            rounded="xl"
                            bg="#CF3F2E"
                            color="white"
                            _hover={{ bg: "#B53626" }}
                            _active={{ bg: "#B53626" }}
                            onClick={() => onInc?.(item.id)}
                          />
                          <IconButton
                            aria-label="Remover"
                            icon={<FiTrash2 />}
                            size="sm"
                            rounded="xl"
                            variant="outline"
                            onClick={() => onRemove?.(item.id)}
                          />
                        </HStack>
                      </HStack>
                    </VStack>
                  </HStack>
                );
              })}

              {items.length === 0 && (
                <Flex
                  direction="column"
                  align="center"
                  justify="center"
                  minH="40vh"
                  textAlign="center"
                  gap={2}
                >
                  <Text fontSize="md" fontWeight="semibold" color="#CF3F2E">
                    Sua sacola está vazia.
                  </Text>
                  <Text fontSize="sm" color="#F59E0B">
                    Adicione itens para continuar.
                  </Text>
                </Flex>
              )}
            </VStack>
          </DrawerBody>

          {/* Footer com os totais fixos na parte de baixo */}
          <DrawerFooter px={0} pt="16px">
            <VStack w="100%" spacing="16px">
              <Box
                w="100%"
                border="1px solid"
                borderColor="gray.100"
                borderRadius="16px"
                p="16px"
                bg="white"
              >
                <HStack justify="space-between" py="8px">
                  <Text fontSize="16px" color="gray.500">
                    Subtotal
                  </Text>
                  <Text fontSize="16px" fontWeight={600} color="gray.800">
                    {formatBRL(derivedSubtotal)}
                  </Text>
                </HStack>
                <Divider />
                <HStack justify="space-between" py="8px">
                  <Text fontSize="16px" color="gray.500">
                    Descontos
                  </Text>
                  <Text fontSize="16px" fontWeight={600} color="gray.800">
                    {formatBRL(derivedDiscounts)}
                  </Text>
                </HStack>
                <Divider />
                <HStack justify="space-between" pt="8px">
                  <Text fontSize="18px" fontWeight={700} color="gray.700">
                    Total
                  </Text>
                  <Text fontSize="18px" fontWeight={700} color="gray.900">
                    {formatBRL(derivedTotal)}
                  </Text>
                </HStack>
              </Box>

              {/* Botão Finalizar Pedido - primário do site */}
              <Button
                onClick={goCheckout}
                w="92%"
                h="48px"
                fontSize="sm"
                fontWeight="700"
                rounded="full"
                alignSelf="center"
                mt="4"
                bg="#CF3F2E"
                color="white"
                _hover={{ bg: "#B53626" }}
                _active={{ bg: "#B53626" }}
              >
                Finalizar Pedido
              </Button>
            </VStack>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Modal 1 - Dados do cliente */}
      <CheckoutModal
        isOpen={checkoutModal.isOpen}
        onClose={checkoutModal.onClose}
        onSuccess={successModal.onOpen}
        subdomain={subdomain}
      />

      {/* Modal 2 - Sucesso */}
      <SuccessModal
        isOpen={successModal.isOpen}
        onClose={successModal.onClose}
      />
    </>
  );
}
