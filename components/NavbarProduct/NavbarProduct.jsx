import { Box, Flex, Icon, Text } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { MdOutlineWest } from "react-icons/md";
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
            w={["44px", "52px"]}
            h={["44px", "52px"]}
            borderRadius="full"
            bg="white"
            display="flex"
            alignItems="center"
            justifyContent="center"
            boxShadow="0px 10px 25px rgba(0, 0, 0, 0.08)"
            _hover={{ transform: "scale(1.05)" }}
            transition="transform 0.2s ease"
          >
            <Icon fontSize="22px" as={MdOutlineWest} color="#0D0D0D" />
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
