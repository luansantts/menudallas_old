import { Box, Flex, Icon, Text } from "@chakra-ui/react";
import Image from "next/image";
import React from "react";
import { BsFillStarFill } from "react-icons/bs";
import Stars from "../InfoStoreHome/Stars";
import { StatusStore } from "../StatusStore";
import { getOpened } from "../../utils/getOpened";

function CardEstablishment({ item, key }) {
  return (
    <Flex
      key={key}
      onClick={() => {
        const domain =
          process.env.NEXT_PUBLIC_BASE_URL_DOMAIN || "localhost:3000";
        window.location.href = `http://${item.nome_pagina}.${domain}`;
      }}
      alignItems="center"
      backgroundColor="#fff"
      boxShadow="0px 4px 6px 8px rgba(0, 0, 0, 0.00)"
      borderRadius="22px"
      w={["100%", "100%", "40%", "24%"]}
      mr={["", "0px", "10%", "1%"]}
      mb={["10px", "10px", "30px"]}
      padding="15px 10px"
      cursor="pointer"
      _hover={{
        transition: "0.3s",
        opacity: 0.8,
      }}
    >
      <Image
        src={
          item.logo_home
            ? item.logo_home
            : "https://imgmenudallas.s3.sa-east-1.amazonaws.com/noimage.png"
        }
        width={104}
        height={90}
        style={{
          borderRadius: "5px",
          height: 90,
          border: "1px solid #00000026",
        }}
        objectFit="cover"
        objectPosition="center"
        alt={item.NOME}
        loader={({ src }) => {
          return src;
        }}
      />

      <Box ml="13px" w="100%">
        <Text as="h4" fontSize="16px" fontWeight={400} color="#000">
          {item.nome}
        </Text>
        <Flex justifyContent="space-between">
          <Flex mb="8px" alignItems="center">
            <Stars data={item} subdomain={item.nome_pagina} />
          </Flex>

          <StatusStore status={getOpened(item)} />
        </Flex>
        <Text fontSize="xs" color="#000" fontWeight={400}>
          {item.segmento}
        </Text>
        <Flex justifyContent="space-between" w="100%" mt="9px">
          <Text fontSize="xs" fontWeight={400} color="#979797">
            {item.tempo_entrega}
          </Text>

          {item.distancia && (
            <Text fontSize="xs" fontWeight={400} color="primary">
              {item.distancia}km
            </Text>
          )}
        </Flex>
      </Box>
    </Flex>
  );
}

export default CardEstablishment;
