import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";

export default function CheckoutModal({
  isOpen,
  onClose,
  onSuccess,
  subdomain,
}) {
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const toast = useToast();

  const handleSubmit = () => {
    if (!name || !cpf) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos antes de finalizar.",
        status: "warning",
        duration: 2500,
        isClosable: true,
      });
      return;
    }

    // Salvar localmente
    localStorage.setItem(
      "@menu-digital:" + subdomain + ":checkoutUser",
      JSON.stringify({ name, cpf })
    );

    onSuccess(); // chama a modal de sucesso
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xs">
      <ModalOverlay bg="blackAlpha.600" />
      <ModalContent
        maxW="360px"
        mx="auto"
        p="6"
        borderRadius="24px"
        boxShadow="lg"
      >
        <ModalHeader
          textAlign="center"
          fontSize="24px"
          lineHeight="28px"
          fontWeight="700"
          fontFamily="'Araboto', system-ui, -apple-system, Segoe UI"
          pb="2"
        >
          Quase lá!
        </ModalHeader>

        <Text textAlign="center" color="gray.500" fontSize="16px" px="2" mb="4">
          Para finalizar o seu pedido, insira os seus dados abaixo.
        </Text>

        <ModalBody display="grid" rowGap="3" pt="0">
          <FormControl>
            <FormLabel
              mb="1"
              fontWeight="700"
              fontFamily="'Araboto', system-ui, -apple-system, Segoe UI"
            >
              Seu nome
            </FormLabel>
            <Input
              placeholder="Digite seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              size="lg"
              borderRadius="16px"
            />
          </FormControl>

          <FormControl>
            <FormLabel
              mb="1"
              fontWeight="700"
              fontFamily="'Araboto', system-ui, -apple-system, Segoe UI"
            >
              Seu CPF
            </FormLabel>
            <Input
              placeholder="Digite seu CPF"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              size="lg"
              borderRadius="16px"
            />
          </FormControl>
        </ModalBody>

        <ModalFooter gap="3" pt="4">
          <Button
            w="full"
            h="48px"
            borderRadius="24px"
            bg="#F1F2F4"
            color="#1F2937"
            border="1px solid #E5E7EB"
            _hover={{ bg: "#E9EBEF" }}
            onClick={onClose}
          >
            Cancelar
          </Button>

          <Button
            w="full"
            h="48px"
            borderRadius="24px"
            bg="#D64B38"
            color="#fff"
            _hover={{ bg: "#C23F2E" }}
            onClick={handleSubmit}
          >
            Finalizar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
