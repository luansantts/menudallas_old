import { Box, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import CartIconButton from "../cart/CartIconButton";

function NavbarProduct({ productData, onOpenCart }) {
  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      w="100%"
      zIndex={20}
      pointerEvents="none"
      pt="env(safe-area-inset-top)"
    >
      <Flex
        justifyContent="space-between"
        alignItems="center"
        padding={["20px 18px", "24px 32px"]}
      >
        <Link href="/lista" passHref legacyBehavior>
          <Box
            as="a"
            pointerEvents="auto"
            w="40px"
            h="40px"
            p="10px"
            borderRadius="100px"
            bg="white"
            display="flex"
            alignItems="center"
            justifyContent="center"
            boxShadow="0px 10px 25px rgba(0, 0, 0, 0.08)"
            _hover={{ transform: "scale(1.05)" }}
            transition="transform 0.2s ease"
          >
            <img
              src="/icons/chevron-left.svg"
              alt="Voltar"
              width={20}
              height={20}
              aria-hidden="true"
              draggable={false}
              style={{ width: 20, height: 20, minWidth: 20, minHeight: 20 }}
            />
          </Box>
        </Link>

        <Box pointerEvents="auto">
          <CartIconButton
            onClick={onOpenCart}
            boxShadow="0px 10px 25px rgba(0, 0, 0, 0.08)"
            _hover={{
              transform: "scale(1.05)",
            }}
            transition="transform 0.2s ease"
          />
        </Box>
      </Flex>
    </Box>
  );
}

export default NavbarProduct;
