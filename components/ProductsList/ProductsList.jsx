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
                fontSize={["18px", "20px"]}
                fontWeight={700}
                color="#1A1A1A"
                mb={["12px", "16px"]}
              >
                {cat.descricao}
              </Text>

              <Box
                bg="white"
                borderRadius="24px"
                border="1px solid #ECECEC"
                overflow="hidden"
              >
                {productsData
                  ?.filter((entry) => filterGpProduct(entry, cat))
                  ?.map((product, index, arr) => (
                    <Flex
                      key={index}
                      cursor="pointer"
                      transition="0.2s ease"
                      w="100%"
                      alignItems="center"
                      py="18px"
                      px={["14px", "20px"]}
                      borderBottom={
                        index !== arr.length - 1 ? "1px solid #F1F5F9" : "none"
                      }
                      _hover={{ bg: "rgba(249, 250, 251, 0.65)" }}
                      onClick={() =>
                        router.push(
                          `/produto/${slugify(product.descricao, {
                            lower: true,
                          })}?g=${product.id_grupo}&p=${product.id_produto}`
                        )
                      }
                    >
                      <Box flex="1" pr={["12px", "18px"]}>
                        <Text
                          fontSize={["15px", "16px"]}
                          fontWeight={600}
                          color="#1F2937"
                          lineHeight="1.3"
                        >
                          {product.descricao}
                        </Text>
                        {product.detalhe && (
                          <Text
                            fontSize="13px"
                            color="#6B7280"
                            noOfLines={2}
                            mt="6px"
                          >
                            {product.detalhe}
                          </Text>
                        )}

                        <Flex alignItems="baseline" gap="10px" mt="12px">
                          {product.tamanhos ? (
                            <Text fontSize="sm" color="#6B7280">
                              De{" "}
                              <Text as="span" fontWeight={600} color="#111827">
                                {moneyFormat.format(product.valor_de || 0)}
                              </Text>{" "}
                              até{" "}
                              <Text as="span" fontWeight={600} color="#111827">
                                {moneyFormat.format(product.valor_ate || 0)}
                              </Text>
                            </Text>
                          ) : (
                            <>
                              {["P", "O"].indexOf(product.tipo) === -1 && (
                                <Text
                                  color="#111827"
                                  fontWeight={700}
                                  fontSize="lg"
                                >
                                  {product?.em_promocao == false
                                    ? moneyFormat.format(product?.valor || 0)
                                    : moneyFormat.format(
                                        product?.valor_Promocao || 0
                                      )}
                                </Text>
                              )}
                              {["P", "O"].indexOf(product.tipo) === -1 &&
                                product?.em_promocao == true && (
                                  <Text
                                    textDecoration="line-through"
                                    color="#9CA3AF"
                                    fontSize="sm"
                                  >
                                    {moneyFormat.format(product?.valor || 0)}
                                  </Text>
                                )}
                            </>
                          )}
                        </Flex>
                      </Box>

                      <Box
                        w={["72px", "84px"]}
                        h={["72px", "84px"]}
                        borderRadius="18px"
                        overflow="hidden"
                        bg="#F8FAFC"
                        flexShrink={0}
                      >
                        <Image
                          className="imgProdList"
                          src={product.foto_destaque}
                          width={100}
                          height={100}
                          objectFit="cover"
                          objectPosition="center"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          alt={product.descricao}
                          loader={({ src }) => {
                            return src;
                          }}
                        />
                      </Box>
                    </Flex>
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
