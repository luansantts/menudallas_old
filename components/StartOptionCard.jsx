import { VStack, Button } from "@chakra-ui/react";
import Image from "next/image";

export default function OptionCard({ img, label, onClick }) {
  return (
    <VStack
      as="button"
      w="128px"
      h="132px"
      bg="white"
      border="1px solid #ECECEC"
      borderRadius="16px"
      boxShadow="0 2px 8px rgba(0,0,0,0.06)"
      justify="center"
      align="center"
      spacing="12px"
      _hover={{ boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}
      transition="box-shadow .18s"
    >
      <Image
        src={img}
        alt=""
        width={70}
        height={70}
        style={{ objectFit: "contain" }}
      />
      <Button
        onClick={onClick}
        h="30px"
        px="16px"
        bg="#F1F2F4"
        _hover={{ bg: "#ECEEF1" }}
        _active={{ bg: "#E7E9ED" }}
        borderRadius="999px"
        color="#3A3A3A"
        fontSize="12px"
        fontWeight="600"
        lineHeight="1"
        whiteSpace="nowrap"
        minW={"auto"}
        boxShadow="0 2px 6px rgba(0,0,0,0.06)"
      >
        {label}
      </Button>
    </VStack>
  );
}
