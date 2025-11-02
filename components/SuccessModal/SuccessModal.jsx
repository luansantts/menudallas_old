import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Button,
  Text,
  VStack,
  Box,
  HStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FiCheck } from "react-icons/fi";

export default function SuccessModal({ isOpen, onClose }) {
  const router = useRouter();

  const handleVerPedidos = () => {
    onClose();
    router.push("/pedidos");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered motionPreset="scale">
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(2px)" />
      <ModalContent
        bg="white"
        rounded="2xl"
        px={{ base: 6, sm: 8 }}
        py={{ base: 6, sm: 8 }}
        boxShadow="xl"
        maxW="xs"
      >
        <ModalBody p="0">
          <VStack spacing={4} align="center" textAlign="center">
            <Box
              rounded="full"
              bg="#D04937"
              w="64px"
              h="64px"
              display="grid"
              placeItems="center"
            >
              <FiCheck size={28} color="#fff" />
            </Box>

            <ModalHeader
              p="0"
              fontSize="xl"
              fontFamily="'Araboto', system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
              fontWeight="800"
            >
              Pedido Efetuado!
            </ModalHeader>

            <Text color="gray.500" fontSize="md" mt="-2">
              Seu pedido foi realizado com sucesso!
            </Text>
          </VStack>
        </ModalBody>

        <ModalFooter p="0" mt={6}>
          <HStack w="full" spacing={3}>
            <Button
              flex="1"
              h="48px"
              rounded="xl"
              variant="outline"
              borderColor="gray.200"
              color="gray.700"
              bg="white"
              _hover={{ bg: "gray.50" }}
              onClick={handleVerPedidos}
            >
              Ver pedidos
            </Button>

            <Button
              flex="1"
              h="48px"
              rounded="xl"
              bg="#D04937"
              color="white"
              _hover={{ bg: "#bb3e2f" }}
              onClick={onClose}
            >
              Continuar
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
