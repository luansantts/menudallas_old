import {
  Box,
  VStack,
  Text,
  Image,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import NextImage from "next/image";

export default function Home() {
  const [selectedTipo, setSelectedTipo] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const tipo = localStorage.getItem("tipo_consumo");
    if (tipo) {
      setSelectedTipo(tipo);
    }
  }, []);

  function selecionarTipo(tipo) {
    try {
      // Salva tanto na chave antiga (compatibilidade) quanto na nova
      localStorage.setItem("tipo_consumo", tipo);
      // Salva como "orderMode" conforme solicitado
      const orderMode = tipo === "local" ? "dine-in" : "takeaway";
      localStorage.setItem("orderMode", orderMode);
    } catch (e) {
      // Ignora erros de localStorage
    }
    setSelectedTipo(tipo);
    // Navega para /lista após selecionar
    router.push("/lista");
  }

  const brandColor = useColorModeValue("#CF3F2E", "#CF3F2E");

  return (
    <Box
      maxW="390px"
      w="100%"
      mx="auto"
      minH="100vh"
      bg="#FFFFFF"
      px="16px"
      py="40px"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      boxSizing="border-box"
      fontFamily="var(--font-poppins), system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif"
    >
      <VStack spacing="48px" w="100%" maxW="342px" alignItems="center">
        <VStack spacing="6px" alignItems="center">
          <Image
            src="https://dallas-0001.s3.sa-east-1.amazonaws.com/logo_0001.png"
            alt="Logo"
            width="82px"
            height="82px"
            borderRadius="8.75px"
            objectFit="cover"
          />
          <Text
            fontWeight="600"
            fontSize="18px"
            lineHeight="27px"
            color="#323232"
          >
            FSW Donald's
          </Text>
        </VStack>

        <VStack spacing="12px" w="100%" maxW="325px" alignItems="center">
          <Text
            fontWeight="600"
            fontSize="26px"
            lineHeight="39px"
            color="#323232"
            textAlign="center"
          >
            Seja bem-vindo!
          </Text>
          <Text
            fontWeight="400"
            fontSize="14px"
            lineHeight="21px"
            color="#7E8392"
            textAlign="center"
          >
            Escolha como prefere aproveitar sua refeição. Estamos aqui para
            oferecer praticidade e sabor em cada detalhe!
          </Text>
        </VStack>

        <Box
          w="100%"
          maxW="342px"
          position="relative"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {/* Linha horizontal por trás dos botões */}
          <Box
            position="absolute"
            left="-24px"
            right="-24px"
            top="50%"
            transform="translateY(-50%)"
            height="1px"
            bg="#F3F4F6"
            zIndex={0}
          />
          
          <Box
            w="100%"
            maxW="342px"
            display="grid"
            gridTemplateColumns={{ base: "repeat(2, 1fr)", sm: "repeat(2, 1fr)" }}
            gap="6px"
            position="relative"
            zIndex={1}
          >
            <CardOpcao
              icon="/img/burger.png"
              label="Para comer aqui"
              tipo="local"
              selectedTipo={selectedTipo}
              onClick={() => selecionarTipo("local")}
              brandColor={brandColor}
            />
            <CardOpcao
              icon="/img/bag.png"
              label="Para levar"
              tipo="viagem"
              selectedTipo={selectedTipo}
              onClick={() => selecionarTipo("viagem")}
              brandColor={brandColor}
            />
          </Box>
        </Box>
      </VStack>
    </Box>
  );
}

function CardOpcao({ icon, label, tipo, selectedTipo, onClick, brandColor }) {
  const isSelected = selectedTipo === tipo;

  return (
    <Box
      as="button"
      role="button"
      aria-pressed={isSelected}
      onClick={onClick}
      bg="#FFFFFF"
      border="1px solid"
      borderColor={isSelected ? brandColor : "#EBF2F5"}
      borderRadius="16px"
      minH="190px"
      p="32px 12px 12px"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="space-between"
      gap="32px"
      transition="transform 0.15s ease, box-shadow 0.15s ease"
      _hover={{
        transform: "translateY(-2px)",
        boxShadow: "0 6px 18px rgba(17, 24, 39, 0.06)",
      }}
      _active={{
        transform: "translateY(0)",
      }}
      _focus={{
        outline: "2px solid",
        outlineColor: brandColor,
        outlineOffset: "2px",
      }}
    >
      <NextImage src={icon} alt={label} width={80} height={80} priority />
      <Box
        display="inline-flex"
        justifyContent="center"
        alignItems="center"
        px="14px"
        py="8px"
        bg="#F4F4F5"
        borderRadius="9999px"
      >
        <Text
          fontWeight="600"
          fontSize="12px"
          lineHeight="18px"
          color="#323232"
          textAlign="center"
        >
          {label}
        </Text>
      </Box>
    </Box>
  );
}
