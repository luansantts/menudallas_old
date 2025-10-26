import { Box, Flex, Text } from "@chakra-ui/react";
import React from "react";

function StatusStore({ status = 1, variant = "classic" }) {
  const isClosed = status === 0;
  const stateColor = isClosed ? "#c90000" : "#468847";

  if (variant === "pill") {
    return (
      <Flex
        alignItems="center"
        borderRadius="999px"
        px="14px"
        py="6px"
        bg={isClosed ? "rgba(234, 84, 85, 0.15)" : "rgba(40, 199, 111, 0.15)"}
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
      w="min-content"
      borderRadius="999px"
      bg={isClosed ? "#FEF2F2" : "#DCFCE7"}
      padding="6px 12px"
      h="auto"
      color={isClosed ? "#DC2626" : "#16A34A"}
      fontSize="12px"
      fontWeight={600}
    >
      <Box
        animation="btn-pisca 1s linear infinite"
        css={`
          @keyframes btn-pisca {
            0% {
              opacity: 0.5;
            }
            50% {
              opacity: 1;
            }
            100% {
              opacity: 0.5;
            }
          }
        `}
        mr="6px"
        w="6px"
        minW="6px"
        h="6px"
        bg={isClosed ? "#DC2626" : "#16A34A"}
        borderRadius="full"
      />
      <Text>{isClosed ? "Fechado" : "Aberto"}</Text>
    </Flex>
  );
}

export default StatusStore;
