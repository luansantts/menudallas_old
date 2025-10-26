import {
  Box,
  Button,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { BsFillChatDotsFill } from "react-icons/bs";
import { FiArrowLeft, FiMenu, FiSearch } from "react-icons/fi";
import { MdHome, MdPercent, MdPerson, MdShoppingBag } from "react-icons/md";
import { FooterStore } from "../FooterStore";

function Navbar({
  isHome = true,
  hasSearch = false,
  setRefreshSearch,
  data,
  subdomain,
  variant = "default",
}) {
  const sidebar = useDisclosure();
  const router = useRouter();

  if (variant === "storefront") {
    return (
      <Box
        position="absolute"
        top="0"
        left="0"
        w="100%"
        px={["16px", "28px"]}
        pt={["16px", "28px"]}
        zIndex={10}
      >
        <Flex alignItems="center" justifyContent="space-between">
          <IconButton
            aria-label="Voltar"
            icon={<FiArrowLeft />}
            onClick={() => router.back()}
            borderRadius="full"
            bg="white"
            color="gray.700"
            boxShadow="0px 10px 30px rgba(15, 23, 42, 0.18)"
            w="48px"
            h="48px"
            _hover={{ bg: "white", transform: "scale(0.98)" }}
          />
          <FooterStore
            data={data}
            subdomain={subdomain}
            variant="floating"
          />
        </Flex>
      </Box>
    );
  }

  return (
    <Box
      bg="#ffffff"
      w="100%"
      padding={["12px 30px", "12px 50px"]}
      height={["68px", "88px"]}
      pt={["6px", "12px"]}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      position="fixed"
      top={0}
      zIndex={9}
      borderBottom="1px solid #ededed"
      flexWrap="wrap"
    >
      <Flex w={{ base: "70%", md: "40%" }} alignItems="center">
        {isHome ? (
          <Link href={process.env.NEXT_PUBLIC_BASE_URL}>
            <Image
              src="/img/logo.png"
              width={100}
              height={64}
              objectFit="contain"
              alt="Menu Dallas"
            />
          </Link>
        ) : (
          <FooterStore data={data} subdomain={subdomain} />
        )}

        {hasSearch && (
          <>
            <InputGroup
              display={{ base: "none", md: "initial" }}
              ml={["20px", "72px"]}
              bg="#fff"
              border="1px solid #999"
              borderRadius="22px"
              maxW="380px"
            >
              <InputLeftElement pointerEvents="none" ml="5px" mt="4px">
                <Icon as={FiSearch} color="primary" fontSize="24px" />
              </InputLeftElement>
              <Input
                type="search"
                onChange={(e) => {
                  localStorage.setItem("@menu-digital:term", e.target.value);
                  setRefreshSearch(true);
                }}
                color="#999"
                placeholder="Pesquise por um produto"
                h="48px"
                borderRadius="22px"
                pl="45px"
                fontSize="xs"
                pt="1px"
                outline={0}
                boxShadow="none !important"
                border="none !important"
              />
            </InputGroup>
          </>
        )}
      </Flex>

      <Flex display={{ base: "none", md: "flex" }} alignItems="center">
        <SidebarContent isHome={isHome} />
      </Flex>

      <Drawer
        isOpen={sidebar.isOpen}
        onClose={sidebar.onClose}
        placement="left"
      >
        <DrawerOverlay />
        <DrawerContent zIndex={9999999}>
          <SidebarContent w="full" borderRight="none" />
        </DrawerContent>
      </Drawer>

      {hasSearch && (
        <Popover>
          <PopoverTrigger>
            <IconButton
              display={{ base: "flex", md: "none" }}
              variant="outline"
              aria-label="open search"
              icon={<FiSearch />}
            />
          </PopoverTrigger>
          <PopoverContent zIndex={99999}>
            <PopoverArrow />
            <PopoverCloseButton mt="5px" />
            <PopoverHeader fontWeight={600}>Pesquisar</PopoverHeader>
            <PopoverBody>
              <Input
                placeholder="Pesquise por um produto"
                color="#999"
                fontSize="xs"
                bg="white"
                fontWeight={600}
                onChange={(e) => {
                  localStorage.setItem("@menu-digital:term", e.target.value);
                  setRefreshSearch(true);
                }}
                _focusVisible={{
                  borderColor: "#9B0506 !important",
                  boxShadow: "0px",
                }}
              />
            </PopoverBody>
          </PopoverContent>
        </Popover>
      )}

      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={sidebar.onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />
    </Box>
  );
}

function SidebarContent({ isHome, ...props }) {
  return (
    <>
      <Flex
        as={Link}
        passHref
        href={props.isHome ? "#" : "/"}
        alignItems="center"
        borderBottom={["3px solid #f8f8f8", "3px solid #f8f8f8", "0px"]}
        mb={["5px", "5px", ""]}
        padding={["15px", "15px", ""]}
        {...props}
      >
        <Icon as={MdHome} fontSize="28px" mr="10px" fill="#000" />
        <Text
          fontSize="sm"
          pt="3px"
          color="#000"
          fontWeight={600}
          letterSpacing="0.5px"
        >
          Início
        </Text>
      </Flex>

      {isHome ? (
        <Flex
          as={Link}
          target="_blank"
          href="https://api.whatsapp.com/send?phone=557399037670&text=Ol%C3%A1,%20gostaria%20de%20saber%20mais%20sobre%20o%20card%C3%A1pio%20Menu%20Dallas"
          alignItems="center"
          borderBottom={["3px solid #f8f8f8", "3px solid #f8f8f8", "0px"]}
          mb={["5px", "5px", ""]}
          padding={["15px", "15px", ""]}
          ml={["0px", "0px", "40px"]}
          {...props}
        >
          <Icon
            as={BsFillChatDotsFill}
            fontSize="28px"
            mr="10px"
            fill="#0BA360"
          />
          <Text
            fontSize="sm"
            pt="3px"
            color="#0BA360"
            fontWeight={600}
            letterSpacing="0.5px"
          >
            Contato
          </Text>
        </Flex>
      ) : (
        <>
          <Flex
            as={Link}
            passHref
            href="/lista"
            alignItems="center"
            borderBottom={["3px solid #f8f8f8", "3px solid #f8f8f8", "0px"]}
            mb={["5px", "5px", ""]}
            padding={["15px", "15px", ""]}
            {...props}
          >
            <Icon as={MdShoppingBag} fontSize="28px" mr="10px" fill="#000" />
            <Text
              fontSize="sm"
              pt="3px"
              color="#000"
              fontWeight={600}
              letterSpacing="0.5px"
            >
              Produtos
            </Text>
          </Flex>
          {/* <Flex as={Link} passHref href={props.isHome ? '#' : '/sobre'} alignItems='center' borderBottom={['3px solid #f8f8f8', '3px solid #f8f8f8', '0px']} mb={['5px', '5px', '']} padding={['15px', '15px', '']} {...props}>
                        <Icon as={MdPercent} fontSize='28px' mr='10px' fill='#000' />
                        <Text fontSize='sm' pt='3px' color='#000' fontWeight={600} letterSpacing='0.5px'>
                            Cupons
                        </Text>
                    </Flex> */}
          <Flex
            as={Link}
            passHref
            href={props.isHome ? "#" : "/perfil"}
            alignItems="center"
            borderBottom={["3px solid #f8f8f8", "3px solid #f8f8f8", "0px"]}
            mb={["5px", "5px", ""]}
            padding={["15px", "15px", ""]}
            {...props}
          >
            <Icon as={MdPerson} fontSize="28px" fill="#000" />
            <Text
              fontSize="sm"
              pt="3px"
              color="#000"
              fontWeight={600}
              letterSpacing="0.5px"
            >
              Perfil
            </Text>
          </Flex>
        </>
      )}
    </>
  );
}

export default Navbar;
