import { Box, Divider, Flex, Text } from "@chakra-ui/react";
import { useKeenSlider } from "keen-slider/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import "keen-slider/keen-slider.min.css";
import { connect } from "react-redux";
import { productsActions, promosActions } from "../../store/actions";
import { isEmpty } from "lodash";
import { moneyFormat } from "../../utils/moneyFormat";
import {
  filterPromotionTamanhoArrayMaior,
  filterPromotionTamanhoArrayMenor,
} from "../../utils/filtersPromotion";
import { useRouter } from "next/router";
import slugify from "slugify";

function MainProducts({
  data,
  promos,
  products,
  getAll,
  getAllProds,
  subdomain,
  refreshSearch,
  setRefreshSearch,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [productsData, setProductsData] = useState([]);
  const [promoTitle, setPromoTitle] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (refreshSearch) {
      if (isEmpty(products)) {
        setProductsData([]);
        setIsLoading(false);
        getAll(data.user_id);
      }

      if (isEmpty(promos)) {
        setIsLoading(false);
        getAllProds(data.user_id);
      }
      setRefreshSearch(false);
    }
  }, [refreshSearch]);

  useEffect(() => {
    if (promos.items && promos.items.length > 0) {
      setPromoTitle(promos.items[0].descricao);
      setProductsData(promos.items[0].produtos);
      setIsLoading(false);
    } else {
      setProductsData([]);
    }

    if (promos.loading) {
      setIsLoading(promos.loading);
    }
  }, [promos]);

  const [sliderRef] = useKeenSlider({
    initial: 0,
    slides: {
      perView: 5,
      spacing: 22,
      origin: "center",
    },
    breakpoints: {
      "(max-width: 768px)": {
        slides: {
          perView: 2,
          spacing: 22,
        },
      },
      "(min-width: 769px) and (max-width: 1500px)": {
        slides: {
          perView: 5,
          spacing: 22,
        },
      },
      "(min-width: 1501px) and (max-width: 1920px)": {
        slides: {
          perView: 7,
          spacing: 22,
        },
      },
      "(min-width: 1921px) and (max-width: 3000px)": {
        slides: {
          perView: 10,
          spacing: 22,
        },
      },
    },
  });

  if (productsData.length == 0) {
    return null;
  }

  return (
    <Box mt={["24px", "48px"]} px={["16px", "48px"]} pt="0">
      <Text
        fontSize={["20px", "24px"]}
        color="#1F2A37"
        fontWeight={700}
        mb={["16px", "24px"]}
      >
        {promoTitle}
      </Text>

      <Box ref={sliderRef} className="keen-slider">
        {productsData.map((product, key) => (
          <Box
            key={key}
            borderRadius="24px"
            className="keen-slider__slide"
            cursor="pointer"
            transition="0.3s"
            _hover={{
              transform: "translateY(-4px)",
            }}
            bg="#fff"
            border="1px solid rgba(15, 23, 42, 0.05)"
            boxShadow="0px 25px 45px rgba(15, 23, 42, 0.08)"
            p="14px"
            onClick={() =>
              router.push(
                `/produto/${slugify(product.descricao, { lower: true })}?g=${
                  product.id_grupo
                }&p=${product.id}`
              )
            }
          >
            <Box
              borderRadius="20px"
              overflow="hidden"
              h="170px"
              mb="12px"
              bg="#F4F6FB"
            >
              <Image
                className="mainImgProds"
                src={product.foto_destaque}
                width={234}
                height={190}
                style={{
                  width: "100%",
                  height: "170px",
                  objectFit: "cover",
                }}
                objectFit="cover"
                objectPosition="center"
                alt={product.descricao}
                loader={({ src }) => {
                  return src;
                }}
              />
            </Box>

            <Box>
              <Text
                fontSize={["15px", "17px"]}
                color="#1F2A37"
                fontWeight={600}
                noOfLines={2}
              >
                {product.descricao}
              </Text>
              {product.detalhe && (
                <Text
                  mt="6px"
                  fontSize="sm"
                  color="#6B7280"
                  noOfLines={2}
                >
                  {product.detalhe}
                </Text>
              )}
              <Flex mt="14px" alignItems="baseline" gap="8px" flexWrap="wrap">
                {["P", "O"].indexOf(product.tipo) > -1 && (
                  <Text
                    color="#10B981"
                    fontWeight={600}
                    fontSize="sm"
                  >
                    {moneyFormat.format(product.valor_de || 0)}{" "}
                    <Text as="span" color="#9CA3AF" fontWeight={400}>
                      até {moneyFormat.format(product.valor_ate || 0)}
                    </Text>
                  </Text>
                )}
                {["P", "O"].indexOf(product.tipo) === -1 && (
                  <Text
                    color="#111827"
                    fontWeight={700}
                    fontSize="lg"
                  >
                    {product?.em_promocao == false
                      ? moneyFormat.format(product?.valor || 0)
                      : moneyFormat.format(product?.valor_promocao || 0)}
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
              </Flex>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function mapState(state) {
  const { promos, products } = state;
  return { promos, products };
}

const actionCreators = {
  getAll: promosActions.getAll,
  getAllProds: productsActions.getAll,
};

export default connect(mapState, actionCreators)(MainProducts);
