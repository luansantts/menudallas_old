import { Box } from "@chakra-ui/react";
import React from "react";

function HeaderHomeStore({ data }) {
  const coverImage = data?.imagem_capa
    ? `url("${data?.imagem_capa}")`
    : 'url("/img/headerExampleStore.png")';

  return (
    <Box
      position="relative"
      w="100%"
      minH={["220px", "300px"]}
      borderRadius="0"
      overflow="hidden"
      boxShadow="none"
      bg={data?.accent_color || "#f1f1f1"}
      backgroundImage={coverImage}
      backgroundSize="cover"
      backgroundPosition="center"
    >
      <Box
        position="absolute"
        inset={0}
        bgGradient="linear(to-b, rgba(0,0,0,0.2), rgba(0,0,0,0.05))"
      />
    </Box>
  );
}

export default HeaderHomeStore;
