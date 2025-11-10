import { Box, Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  filterGpProduct,
  filterPromotionTamanhoArrayMaior,
  filterPromotionTamanhoArrayMenor,
} from "../../utils/filtersPromotion";
import { useRouter } from "next/router";
import slugify from "slugify";
import { moneyFormat } from "../../utils/moneyFormat";

// Usando as mesmas constantes do MenuOptionsStore
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutos em ms
const CACHE_KEY_PREFIX = "menu_dallas_categories_";

function ProductsList({ data, products, categories }) {
  const [categoriesData, setCategoriesData] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const router = useRouter();

  // Carregar categorias do cache ou do estado do Redux
  useEffect(() => {
    // Primeiro, tenta carregar do cache
    const loadCategoriesFromCache = () => {
      try {
        if (typeof window !== "undefined") {
          const cacheKey = `${CACHE_KEY_PREFIX}${data?.user_id}`;
          const cachedDataStr = localStorage.getItem(cacheKey);

          if (cachedDataStr) {
            const { data: cachedData, timestamp } = JSON.parse(cachedDataStr);

            // Se o cache não expirou, use os dados
            if (Date.now() - timestamp < CACHE_DURATION) {
              console.log("ProductsList: Using cached categories data");
              setCategoriesData(cachedData);
              return true;
            }
          }
        }
      } catch (error) {
        console.error("ProductsList: Error loading cached categories:", error);
      }
      return false;
    };

    // Tenta usar o cache primeiro
    const usedCache = loadCategoriesFromCache();

    // Se não tiver cache válido, usa dados do Redux
    if (!usedCache && categories?.items) {
      console.log("ProductsList: Using Redux categories data");
      setCategoriesData(categories.items);
    }
  }, [data?.user_id, categories]);

  // Atualizar dados de produtos quando o Redux mudar
  useEffect(() => {
    if (products.items) {
      setProductsData(products.items);
    } else {
      setProductsData([]);
    }
  }, [products]);

  return (
    <Box className="page-center" bg="white" pt="0" pb={["100px", "120px"]}>
      {categoriesData.map(
        (cat, keyCat) =>
          productsData?.filter((entry) => filterGpProduct(entry, cat)).length >
            0 && (
            <Box
              mt={["24px", "32px"]}
              key={keyCat}
              id={slugify(cat.descricao, { lower: true })}
            >
              <Text
                className="category-title"
                fontSize={["18px", "20px"]}
                fontWeight={700}
                color="#1A1A1A"
                mb={["12px", "16px"]}
              >
                {cat.descricao}
              </Text>

              <Box>
                {productsData
                  ?.filter((entry) => filterGpProduct(entry, cat))
                  ?.map((product, index, arr) => (
                    <>
                      <Flex
                        key={index}
                        className="product-row"
                        cursor="pointer"
                        transition="0.2s ease"
                        w="100%"
                        justify="space-between"
                        align="center"
                        gap={4}
                        py="12px"
                        px={["16px", "20px"]}
                        bg="transparent"
                        borderRadius="0"
                        border="none"
                        boxShadow="none"
                        _hover={{ bg: "rgba(249, 250, 251, 0.65)" }}
                        onClick={() =>
                          router.push(
                            `/produto/${slugify(product.descricao, {
                              lower: true,
                            })}?g=${product.id_grupo}&p=${product.id_produto}`
                          )
                        }
                      >
                        <Flex
                          flex="1"
                          pr={["12px", "18px"]}
                          direction="column"
                          justify="space-between"
                          minH="100px"
                          minW={0}
                          className="product-info"
                        >
                          <Box>
                            <Text
                              className="list-product-title"
                              as="h3"
                              fontSize="16px"
                              lineHeight="22px"
                              fontWeight="500"
                              color="gray.800"
                              letterSpacing="-0.2px"
                              noOfLines={1}
                            >
                              {product.descricao}
                            </Text>

                            {product.detalhe && (
                              <Text
                                className="list-product-subtitle"
                                fontSize="14px"
                                lineHeight="20px"
                                color="#6b7280"
                                mt="4px"
                                noOfLines={2}
                              >
                                {product.detalhe}
                              </Text>
                            )}
                          </Box>

                          <Text
                            className="product-price"
                            fontSize="16px"
                            fontWeight="600"
                            color="#222"
                            mt="8px"
                            mb="6px"
                          >
                            {product.tamanhos
                              ? moneyFormat.format(product.valor_de || 0)
                              : ["P", "O"].indexOf(product.tipo) === -1 &&
                                (product?.em_promocao == false
                                  ? moneyFormat.format(product?.valor || 0)
                                  : moneyFormat.format(
                                      product?.valor_Promocao || 0
                                    ))}
                          </Text>
                        </Flex>

                        <Box
                          className="product-thumb"
                          w="82px"
                          h="82px"
                          borderRadius="9.23944px"
                          bg="rgba(0, 0, 0, 0.08)"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          overflow="hidden"
                          flexShrink={0}
                          flexGrow={0}
                          position="relative"
                        >
                          <Image
                            className="imgProdList"
                            src={product.foto_destaque}
                            width={82}
                            height={82}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "contain",
                              objectPosition: "center",
                              display: "block",
                            }}
                            alt={product.descricao}
                            loader={({ src }) => {
                              return src;
                            }}
                          />
                        </Box>
                      </Flex>
                      {index !== arr.length - 1 && (
                        <Box className="product-divider" />
                      )}
                    </>
                  ))}
              </Box>
            </Box>
          )
      )}
    </Box>
  );
}

function mapState(state) {
  const { categories, products } = state;
  return { categories, products };
}

const actionCreators = {};

export default connect(mapState, actionCreators)(ProductsList);
