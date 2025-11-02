import { Box, Button, Container, Flex, Text, useToast } from "@chakra-ui/react";
import React from "react";
import { moneyFormat } from "../../utils/moneyFormat";

function FooterProduct({ data, opened, total, handleItemOrder, disable }) {
  const toast = useToast();

  const handleAddToBag = () => {
    if (disable) {
      toast({
        title: "Alerta",
        description: "Preencha todos os campos obrigatórios",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "top-center",
      });
      return;
    }

    handleItemOrder();
  };

  return (
    <Box
      position="fixed"
      bottom={0}
      left={0}
      w="100%"
      zIndex={998}
      bg="transparent"
    >
      <Container maxW="4xl" px={["20px", "32px"]} py="20px">
        <Box
          bg="white"
          borderRadius="40px"
          boxShadow="0px -20px 60px rgba(15, 23, 42, 0.15)"
          p={["12px", "16px"]}
        >
          {!opened ? (
            <Box textAlign="center" py="10px">
              <Text fontSize="lg" fontWeight={700}>
                Fechado no momento!
              </Text>
              <Text fontSize="sm" color="#6B7280">
                No momento, não estamos aceitando novos pedidos.
              </Text>
            </Box>
          ) : (
            <Button
              w="100%"
              borderRadius="full"
              py="26px"
              fontSize="18px"
              fontWeight={700}
              color={disable ? "#6B7280" : "#fff"}
              bg={disable ? "#E5E7EB" : data?.primary_color || undefined}
              bgGradient={
                disable || data?.primary_color
                  ? undefined
                  : "linear(to-r, #FFC42D, #F59E0B)"
              }
              _hover={disable ? {} : { opacity: 0.9 }}
              onClick={handleAddToBag}
            >
              <Flex w="100%" alignItems="center" justifyContent="space-between">
                <Text>Adicionar à Sacola</Text>
                <Text>{moneyFormat.format(total)}</Text>
              </Flex>
            </Button>
          )}
        </Box>
      </Container>
    </Box>
  );
}

export default FooterProduct;
