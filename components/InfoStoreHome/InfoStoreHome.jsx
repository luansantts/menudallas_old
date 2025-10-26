import {
  Box,
  Button,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  Text,
} from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import React, { useMemo } from "react";
import {
  FaFacebook,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhone,
  FaWhatsapp,
} from "react-icons/fa";
import { FiClock } from "react-icons/fi";
import { MdInfo, MdMessage, MdShare } from "react-icons/md";
import { StatusStore } from "../StatusStore";
import { getOpened } from "../../utils/getOpened";
import { moneyFormat } from "../../utils/moneyFormat";
import { InlineShareButtons } from "sharethis-reactjs";
import Stars from "./Stars";

function InfoStoreHome({ data = {}, type = 1, subdomain }) {
  const shareUrl =
    subdomain && process.env.NEXT_PUBLIC_BASE_URL_DOMAIN
      ? "https://" + subdomain + "." + process.env.NEXT_PUBLIC_BASE_URL_DOMAIN
      : process.env.NEXT_PUBLIC_BASE_URL_DOMAIN
      ? "https://" + process.env.NEXT_PUBLIC_BASE_URL_DOMAIN
      : typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000";

  if (type === 2) {
    return (
      <StorefrontInfo data={data} subdomain={subdomain} shareUrl={shareUrl} />
    );
  }

  return (
    <Box
      borderRadius="44px 44px 0px 0px"
      bg="white"
      borderTop="4px solid #F5F5F5"
      mt="-3rem"
      h={type === 1 ? ["100%", "100%"] : ["initial", "340px"]}
      pb={["20px", ""]}
      paddingLeft="5%"
      paddingRight="5%"
    >
      <Box
        borderRadius="83.5px"
        bg="white"
        boxShadow="0px 4px 4px 0px rgba(0, 0, 0, 0.25)"
        w="130px"
        h="130px"
        overflow="hidden"
        display="flex"
        alignItems="center"
        justifyContent="center"
        m="0px auto"
        position="relative"
        top="-3rem"
        mb="17px"
        bgImage={`url("${
          data.logo_home
            ? data.logo_home
            : "https://imgmenudallas.s3.sa-east-1.amazonaws.com/noimage.png"
        }")`}
        backgroundSize="contain"
        backgroundPosition="center"
        bgRepeat="no-repeat"
      ></Box>

      <Box mt="-3.5rem">
        {type === 1 ? (
          <>
            <Text
              as="h1"
              color={data?.primary_color}
              fontSize={["24px", "32px"]}
              fontWeight={700}
              letterSpacing="0.5px"
              textAlign="center"
              mb="11px"
            >
              {data.nome}
            </Text>
            <Text
              color="#000"
              fontSize="xs"
              fontStyle="italic"
              fontWeight={400}
              letterSpacing="0.5px"
              textAlign="center"
            >
              {data.frase_home}
            </Text>
          </>
        ) : (
          <Flex flexWrap={["wrap", "initial"]} justifyContent="center">
            <Text
              as="h1"
              color={data?.primary_color}
              fontSize={["24px", "32px"]}
              lineHeight={["26px", "36px"]}
              fontWeight={700}
              letterSpacing="0.5px"
              textAlign="center"
            >
              {data.nome}
            </Text>
            <Flex ml="11px" alignItems="center">
              <Stars data={data} subdomain={subdomain} />
            </Flex>
          </Flex>
        )}

        {type === 1 && (
          <>
            <Flex
              mt="17px"
              mb="17px"
              justifyContent="center"
              alignItems="center"
            >
              <StatusStore status={getOpened(data)} />

              <Flex ml="11px" alignItems="center">
                <Stars data={data} subdomain={subdomain} />
              </Flex>
            </Flex>

            <Flex justifyContent="center" mb="47px">
              <Link href="/lista">
                <Button
                  variant="transparent"
                  bg={data?.primary_color}
                  p="17px 27px"
                  color="#fff"
                  borderRadius="15px"
                  fontSize="sm"
                  transition="0.3s"
                  _hover={{
                    opacity: 0.8,
                  }}
                >
                  Faça seu pedido
                </Button>
              </Link>
            </Flex>

            <Text
              textAlign="center"
              opacity="0.5"
              color="#000"
              fontSize="11px"
              fontWeight={400}
              letterSpacing="0.5px"
            >
              {data?.endereco}, {data?.numero} - {data?.bairro}, {data?.cidade}/
              {data?.estado}
            </Text>
          </>
        )}

        <Flex mt="14px" justifyContent="center" flexWrap="wrap" columnGap={2}>
          {data?.numero_whats && (
            <a
              target="_blank"
              href={`https://wa.me/55${data?.numero_whats
                .replace("(", "")
                .replace(")", "")
                .replace("-", "")}`}
            >
              <Button
                variant="transparent"
                transition="0.3s"
                _hover={{
                  opacity: 0.6,
                }}
                border="2px solid"
                borderColor={data?.primary_color}
                maxW="32px"
                minW="32px"
                w="32px"
                h="32px"
                borderRadius="20px"
                p="0px"
              >
                <Icon as={FaWhatsapp} color={data?.primary_color} />
              </Button>
            </a>
          )}

          {data?.telefone && (
            <a
              href={`tel:${data?.telefone
                .replace("(", "")
                .replace(")", "")
                .replace("-", "")}`}
            >
              <Button
                variant="transparent"
                transition="0.3s"
                _hover={{
                  opacity: 0.6,
                }}
                border="2px solid"
                borderColor={data?.primary_color}
                maxW="32px"
                minW="32px"
                w="32px"
                h="32px"
                borderRadius="20px"
                p="0px"
              >
                <Icon as={FaPhone} color={data?.primary_color} />
              </Button>
            </a>
          )}

          <a
            href={`https://www.google.com/maps/place/${data?.endereco}, ${data?.numero} - ${data?.bairro}, ${data?.cidade}/${data?.estado}`}
            target="_blank"
          >
            <Button
              variant="transparent"
              transition="0.3s"
              _hover={{
                opacity: 0.6,
              }}
              border="2px solid"
              borderColor={data?.primary_color}
              maxW="32px"
              minW="32px"
              w="32px"
              h="32px"
              borderRadius="20px"
              p="0px"
            >
              <Icon as={FaMapMarkerAlt} color={data?.primary_color} />
            </Button>
          </a>

          {data?.instagram && (
            <a href={data?.instagram} target="_blank">
              <Button
                variant="transparent"
                transition="0.3s"
                _hover={{
                  opacity: 0.6,
                }}
                border="2px solid"
                borderColor={data?.primary_color}
                maxW="32px"
                minW="32px"
                w="32px"
                h="32px"
                borderRadius="20px"
                p="0px"
              >
                <Icon as={FaInstagram} color={data?.primary_color} />
              </Button>
            </a>
          )}

          {data?.facebook && (
            <a href={data?.facebook} target="_blank">
              <Button
                variant="transparent"
                transition="0.3s"
                _hover={{
                  opacity: 0.6,
                }}
                border="2px solid"
                borderColor={data?.primary_color}
                maxW="32px"
                minW="32px"
                w="32px"
                h="32px"
                borderRadius="20px"
                p="0px"
              >
                <Icon as={FaFacebook} color={data?.primary_color} />
              </Button>
            </a>
          )}

          {type === 2 && (
            <>
              <Link href="/sobre">
                <Button
                  variant="transparent"
                  transition="0.3s"
                  _hover={{
                    opacity: 0.6,
                  }}
                  border="2px solid"
                  borderColor={data?.primary_color}
                  maxW="32px"
                  minW="32px"
                  w="32px"
                  h="32px"
                  borderRadius="20px"
                  p="0px"
                >
                  <Icon as={MdInfo} color={data?.primary_color} />
                </Button>
              </Link>

              <Menu isLazy>
                <MenuButton
                  variant="transparent"
                  transition="0.3s"
                  _hover={{
                    opacity: 0.6,
                  }}
                  border="2px solid"
                  borderColor={data?.primary_color}
                  maxW="32px"
                  minW="32px"
                  w="32px"
                  h="32px"
                  borderRadius="20px"
                  p="0px"
                >
                  <Icon as={MdShare} color={data?.primary_color} mt="6px" />
                </MenuButton>
                <MenuList>
                  <InlineShareButtons
                    config={{
                      alignment: "center",
                      color: "social",
                      enabled: true,
                      font_size: 16,
                      networks: [
                        "whatsapp",
                        "linkedin",
                        "messenger",
                        "facebook",
                        "twitter",
                      ],
                      padding: 12,
                      radius: 4,
                      show_total: true,
                      size: 30,
                      url: shareUrl,
                    }}
                  />
                </MenuList>
              </Menu>

              <Link href="/avaliacoes">
                <Button
                  variant="transparent"
                  transition="0.3s"
                  _hover={{
                    opacity: 0.6,
                  }}
                  border="2px solid"
                  borderColor={data?.primary_color}
                  maxW="32px"
                  minW="32px"
                  w="32px"
                  h="32px"
                  borderRadius="20px"
                  p="0px"
                >
                  <Icon as={MdMessage} color={data?.primary_color} />
                </Button>
              </Link>
            </>
          )}
        </Flex>

        {type === 2 && (
          <>
            <Flex
              flexWrap="wrap"
              justifyContent="center"
              mt="21px"
              mb={["5px", ""]}
            >
              <Flex alignItems="center">
                <Image
                  src="/img/moneyIcon.png"
                  width={17}
                  height={23}
                  objectFit="cover"
                  alt="Menu Dallas Dinheiro"
                  style={{
                    minHeight: 23,
                  }}
                />

                <Text ml="5px" fontSize="12px">
                  Pedido mínimo{" "}
                  <Text as="b">{moneyFormat.format(data?.valor_minimo)}</Text>
                </Text>
              </Flex>

              {data?.frase_tempo_buscar && (
                <Flex
                  alignItems="center"
                  ml={["15px", "22px"]}
                  mb={["5px", ""]}
                >
                  <Image
                    src="/img/clockIcon.png"
                    width={17}
                    height={17}
                    objectFit="cover"
                    alt="Menu Dallas Dinheiro"
                    style={{
                      minHeight: 17,
                    }}
                  />

                  <Text ml="5px" fontSize="12px">
                    {data?.frase_tempo_buscar}
                  </Text>
                </Flex>
              )}

              {data?.frase_tempo_delivery && (
                <Flex
                  alignItems="center"
                  ml={["15px", "22px"]}
                  mb={["5px", ""]}
                >
                  <Image
                    src="/img/motoIcon.png"
                    width={17}
                    height={12}
                    objectFit="cover"
                    alt="Menu Dallas Dinheiro"
                    style={{
                      minHeight: 12,
                    }}
                  />

                  <Text ml="5px" fontSize="12px">
                    {data?.frase_tempo_delivery}
                  </Text>
                </Flex>
              )}
            </Flex>
            <Text
              textAlign="center"
              mt="17px"
              color="#000"
              fontSize="12px"
              fontWeight={400}
              letterSpacing="0.5px"
            >
              {data?.endereco}, {data?.numero} - {data?.bairro}, {data?.cidade}/
              {data?.estado}
            </Text>
            <Box w="75px" m="0px auto" mt="17px">
              <StatusStore status={getOpened(data)} />
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}

export default InfoStoreHome;

const StorefrontInfo = ({ data, subdomain, shareUrl }) => {
  const displayName = useMemo(() => {
    if (!data?.nome) return "";
    return data?.nome.split("-")[0].trim();
  }, [data?.nome]);

  const subtitle =
    data?.segmento || data?.frase_home || data?.categoria || "Fast Food";

  const logoUrl = data?.logo_home
    ? data?.logo_home
    : "https://imgmenudallas.s3.sa-east-1.amazonaws.com/noimage.png";

  const isOpen = getOpened(data);

  return (
    <Box className="page-center store-info">
      <Box className="store-info">
        <Image
          src={logoUrl}
          width={56}
          height={56}
          borderRadius="12px"
          objectFit="cover"
          alt={data?.nome || "Logo da loja"}
          className="store-logo"
        />
        <Box className="store-info-col">
          <Box className="store-info-top">
            <Text className="store-name">{displayName || data?.nome}</Text>
            <Box className="rating-badge">
              <Stars data={data} subdomain={subdomain} />
            </Box>
          </Box>
          <Text className="store-category">{subtitle}</Text>
          <Flex className="status-open">
            <StatusStore status={getOpened(data)} />
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};
