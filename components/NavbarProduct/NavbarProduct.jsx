import { Box, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import CartIconButton from "../cart/CartIconButton";

function NavbarProduct({ productData, onOpenCart, subdomain }) {
  const [bagCount, setBagCount] = useState(0);

  useEffect(() => {
    try {
      const b = localStorage.getItem("@menu-digital:" + subdomain + ":bag");
      if (b) {
        setBagCount(JSON.parse(b).length || 0);
      } else {
        setBagCount(0);
      }
    } catch {
      setBagCount(0);
    }
    const interval = setInterval(() => {
      try {
        const b = localStorage.getItem("@menu-digital:" + subdomain + ":bag");
        if (b) {
          setBagCount(JSON.parse(b).length || 0);
        } else {
          setBagCount(0);
        }
      } catch {
        setBagCount(0);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [subdomain]);

  return (
    <Box
      position="absolute"
      top={0}
      left={0}
      right={0}
      w="100%"
      zIndex={10}
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

        <Box pointerEvents="auto" position="relative">
          <CartIconButton
            onClick={onOpenCart}
            boxShadow="0px 10px 25px rgba(0, 0, 0, 0.08)"
            _hover={{
              transform: "scale(1.05)",
            }}
            transition="transform 0.2s ease"
          />
          {bagCount > 0 && (
            <Flex
              position="absolute"
              top="-6px"
              right="-8px"
              borderRadius="full"
              bg="#FEAD1D"
              color="white"
              minW="22px"
              h="22px"
              fontSize="12px"
              fontWeight={700}
              alignItems="center"
              justifyContent="center"
              border="2px solid white"
            >
              {bagCount}
            </Flex>
          )}
        </Box>
      </Flex>
    </Box>
  );
}

export default NavbarProduct;
