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
  Icon,
  Image,
  Divider,
  Button,
  useDisclosure,
  Flex,
} from "@chakra-ui/react";
import { FiChevronLeft, FiChevronRight, FiTrash2 } from "react-icons/fi";
import { useRouter } from "next/router";

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
    // Ir direto para a página de confirmação do pedido
    onClose?.();
    router.push("/meu-pedido");
  };

  return (
    <>
      <Drawer placement="right" isOpen={isOpen} onClose={onClose}>
        <DrawerOverlay bg="blackAlpha.400" />
        <DrawerContent
          w="92vw"
          maxW="400px"
          borderLeftRadius="2xl"
          boxShadow="xl"
          className="cart-modal"
          display="flex"
          flexDirection="column"
        >
          <DrawerCloseButton top="22px" right="22px" size="lg" />
          <DrawerHeader
            fontSize="18px"
            fontWeight="600"
            px="20px"
            h="40px"
            py="0"
            display="flex"
            alignItems="center"
            borderBottom="none"
            borderBottomWidth="0"
            borderColor="transparent"
          >
            Sacola
          </DrawerHeader>

          <DrawerBody
            overflowY="auto"
            px="20px"
            pt="8px"
            pb="0"
            display="flex"
            flexDirection="column"
          >
            <VStack align="stretch" spacing="16px" flex="1" mb="24px">
              {items.map((item) => {
                const unit = parseBRL(
                  item.price ?? item.unitPrice ?? item.valor
                );
                const qty = Number(item.qty) || 1;
                const lineTotal = unit * qty; // Total da linha (preço × quantidade)

                return (
                  <Flex
                    key={item.id}
                    className="cart-item"
                    direction="row"
                    align="center"
                    p="0"
                    gap="16px"
                    w="100%"
                  >
                    {/* Thumbnail */}
                    <Box
                      className="thumb"
                      w="77px"
                      h="77px"
                      borderRadius="9px"
                      bg="rgba(0,0,0,0.08)"
                      overflow="hidden"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      flexShrink={0}
                    >
                      <Image
                        src={item.imageUrl || "/placeholder.png"}
                        alt={item.name}
                        w="100%"
                        h="100%"
                        objectFit="cover"
                      />
                    </Box>

                    {/* Coluna de informações */}
                    <Flex
                      className="info"
                      direction="column"
                      align="flex-start"
                      flex="1"
                      minW="0"
                      gap="4px"
                    >
                      <Text
                        className="cart-item-title"
                        noOfLines={1}
                        fontFamily="var(--font-poppins), system-ui, -apple-system, sans-serif"
                        fontWeight="400"
                        fontSize="12px"
                        lineHeight="16px"
                        color="#323232"
                        w="100%"
                      >
                        {item.name}
                      </Text>

                      <Text
                        className="price-pill"
                        fontFamily="var(--font-poppins), system-ui, -apple-system, sans-serif"
                        fontWeight="600"
                        fontSize="14px"
                        lineHeight="20px"
                        color="#323232"
                      >
                        {formatBRL(lineTotal)}
                      </Text>

                      {/* Controles: quantidade + remover na mesma linha */}
                      <HStack
                        className="qty"
                        spacing="8px"
                        mt="4px"
                        align="center"
                      >
                        <IconButton
                          aria-label="Diminuir"
                          onClick={() => onDec?.(item.id)}
                          w="32px"
                          h="32px"
                          minW="32px"
                          p="8px"
                          bg="#FFFFFF"
                          border="1px solid #E5E7EB"
                          borderRadius="8px"
                          color="#323232"
                          _hover={{ bg: "#F9FAFB" }}
                          icon={<Icon as={FiChevronLeft} boxSize="16px" />}
                        />
                        <Text
                          fontFamily="var(--font-poppins), system-ui, -apple-system, sans-serif"
                          fontWeight="400"
                          fontSize="14px"
                          lineHeight="20px"
                          color="#323232"
                          w="24px"
                          textAlign="center"
                        >
                          {qty}
                        </Text>
                        <IconButton
                          aria-label="Aumentar"
                          onClick={() => onInc?.(item.id)}
                          w="32px"
                          h="32px"
                          minW="32px"
                          p="8px"
                          bg="#D52B1E"
                          color="#FFFFFF"
                          borderRadius="10px"
                          border="transparent"
                          _hover={{ bg: "#B32017" }}
                          _active={{ bg: "#B32017", boxShadow: "none" }}
                          _focusVisible={{ boxShadow: "none" }}
                          icon={<Icon as={FiChevronRight} boxSize="16px" />}
                        />
                        <IconButton
                          aria-label="Remover"
                          onClick={() => onRemove?.(item.id)}
                          w="32px"
                          h="32px"
                          minW="32px"
                          p="8px"
                          bg="#FFFFFF"
                          border="1px solid #E5E7EB"
                          borderRadius="8px"
                          ml="8px"
                          _hover={{ bg: "#F9FAFB" }}
                          icon={<Icon as={FiTrash2} boxSize="16px" />}
                        />
                      </HStack>
                    </Flex>
                  </Flex>
                );
              })}

              {items.length === 0 && (
                <VStack
                  className="cart-empty"
                  spacing="1"
                  align="center"
                  justify="center"
                >
                  <Text className="cart-empty__title">
                    Sua sacola está vazia.
                  </Text>
                  <Text className="cart-empty__subtitle">
                    Adicione itens para continuar.
                  </Text>
                </VStack>
              )}
            </VStack>
          </DrawerBody>

          {/* Footer com os totais fixos na parte de baixo */}
          <DrawerFooter px="20px" pt="0" pb="20px">
            <VStack
              w="100%"
              spacing="16px"
              className="cart-frame"
              flex="1"
              justify="flex-end"
            >
              <Box
                className="cart-status"
                w="100%"
                border="1px solid"
                borderColor="#E5E7EB"
                borderRadius="12px"
                p="20px"
                bg="white"
              >
                <HStack justify="space-between" className="cart-row">
                  <Text fontSize="12px" color="#6B7280">
                    Subtotal
                  </Text>
                  <Text fontSize="12px" fontWeight={400} color="#323232">
                    {formatBRL(derivedSubtotal)}
                  </Text>
                </HStack>
                <Divider
                  className="cart-divider"
                  my="12px"
                  borderColor="#E5E7EB"
                />
                <HStack justify="space-between" className="cart-row">
                  <Text fontSize="12px" color="#6B7280">
                    Descontos
                  </Text>
                  <Text fontSize="12px" fontWeight={400} color="#323232">
                    {derivedDiscounts > 0 ? "-" : ""}
                    {formatBRL(derivedDiscounts)}
                  </Text>
                </HStack>
                <Divider
                  className="cart-divider"
                  my="12px"
                  borderColor="#E5E7EB"
                />
                <HStack justify="space-between" className="cart-row total">
                  <Text fontSize="14px" fontWeight={600} color="#323232">
                    Total
                  </Text>
                  <Text fontSize="14px" fontWeight={600} color="#323232">
                    {formatBRL(derivedTotal)}
                  </Text>
                </HStack>
              </Box>

              {/* Botão Finalizar Pedido */}
              <Button
                className="cart-cta"
                onClick={goCheckout}
                w="100%"
                py="14px"
                px="16px"
                h="auto"
                fontSize="14px"
                fontWeight="600"
                rounded="full"
                borderRadius="62px"
                bg="#FFB100"
                color="white"
                boxShadow="0px 2px 8px rgba(255, 177, 0, 0.3)"
                mx="auto"
                _hover={{
                  bg: "#E8A000",
                  boxShadow: "0px 4px 12px rgba(255, 177, 0, 0.4)",
                }}
                _active={{ bg: "#E8A000" }}
                disabled={items.length === 0}
                _disabled={{ opacity: 0.5, cursor: "not-allowed" }}
              >
                Finalizar pedido
              </Button>
            </VStack>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

    </>
  );
}
