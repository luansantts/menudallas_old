import {
  Box,
  Flex,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Image,
  Icon,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { GiHamburger } from "react-icons/gi";
import { BsBagFill } from "react-icons/bs";

export default function Home() {
  // Função de seleção que salva tipo_consumo (pode redirecionar)
  function selecionarTipo(tipo) {
    localStorage.setItem("tipo_consumo", tipo);
    // Descomente abaixo se quiser já redirecionar:
    // router.push("/lista");
  }

  return (
    <Flex bg="#F6FAFF" minH="100vh" px={4} align="center" justify="center">
      <VStack spacing={8} w="100%" maxW="480px" textAlign="center">
        {/* Logo + nome */}
        <VStack spacing={2}>
          <Image
            src="https://dallas-0001.s3.sa-east-1.amazonaws.com/logo_0001.png"
            alt="Logo"
            boxSize={{ base: "64px", sm: "72px" }}
            mx="auto"
          />
          <Text fontWeight="600" color="gray.700">
            FSW Donald's
          </Text>
        </VStack>

        {/* Título e subtítulo */}
        <VStack spacing={2} px={4}>
          <Heading as="h1" size="lg" lineHeight="1.1" color="gray.800">
            Seja bem-vindo!
          </Heading>
          <Text fontSize="sm" color="gray.500" maxW="340px" mx="auto">
            Escolha como prefere aproveitar sua refeição. Estamos aqui para
            oferecer praticidade e sabor em cada detalhe!
          </Text>
        </VStack>

        {/* Cards de escolha */}
        <HStack spacing={6} flexWrap="wrap" justify="center" w="100%">
          {/* Para comer aqui */}
          <CardOpcao
            icon={GiHamburger}
            label="Para comer aqui"
            onClick={() => selecionarTipo("local")}
          />
          {/* Para levar */}
          <CardOpcao
            icon={BsBagFill}
            label="Para levar"
            onClick={() => selecionarTipo("viagem")}
          />
        </HStack>
      </VStack>
    </Flex>
  );
}

/** Card de opção estilizado */
function CardOpcao({ icon, label, onClick }) {
  return (
    <VStack
      spacing={4}
      w="150px"
      h="190px"
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      rounded="2xl"
      boxShadow="sm"
      p={4}
      transition="all .2s ease"
      _hover={{
        transform: "translateY(-2px)",
        boxShadow: "md",
        borderColor: "gray.300",
      }}
    >
      <Icon as={icon} boxSize={{ base: 16, sm: 20 }} color="gray.700" />
      <Button
        onClick={onClick}
        size="sm"
        rounded="full"
        px={4}
        fontWeight="600"
        bg="gray.100"
        color="gray.700"
        _hover={{ bg: "gray.200" }}
        _active={{ bg: "gray.300" }}
      >
        {label}
      </Button>
    </VStack>
  );
}
