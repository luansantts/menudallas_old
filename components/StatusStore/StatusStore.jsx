import { Box, Flex, Text, Icon } from "@chakra-ui/react";
import { FiClock } from "react-icons/fi";
import React from "react";

function StatusStore({ status = 1, variant = "classic" }) {
  const isOpen = status === true || status === 1;
  const isClosed = !isOpen;
  const stateColor = isClosed ? "#DC2626" : "#059669";

  if (variant === "pill") {
    return (
      <Flex
        alignItems="center"
        borderRadius="999px"
        px="14px"
        py="6px"
        bg={isClosed ? "#FEF2F2" : "#ECFDF5"}
        color={stateColor}
        fontSize="sm"
        fontWeight={600}
        minH="38px"
      >
        <Box
          mr="6px"
          w="8px"
          h="8px"
          borderRadius="full"
          bg={stateColor}
          animation="btn-pisca 1s linear infinite"
          css={`
            @keyframes btn-pisca {
              0% {
                opacity: 0.2;
              }
              50% {
                opacity: 1;
              }
              100% {
                opacity: 0.2;
              }
            }
          `}
        />
        <Text>{isClosed ? "Fechado" : "Aberto"}</Text>
      </Flex>
    );
  }

  return (
    <Flex
      alignItems="center"
      gap="4px"
      bg="transparent"
      color={isClosed ? "#DC2626" : "#059669"}
      fontSize="15px"
      fontWeight={500}
    >
      <Icon as={FiClock} fontSize="15px" />
      <Text>{isClosed ? "Fechado" : "Aberto"}</Text>
    </Flex>
  );
}

export default StatusStore;
