import {
  Box,
  Button,
  Flex,
  Skeleton,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useKeenSlider } from "keen-slider/react";
import React, { useEffect, useState, useRef } from "react";
import "keen-slider/keen-slider.min.css";
import { connect } from "react-redux";
import { categoriesActions } from "../../store/actions";
import { isEmpty } from "lodash";
import slugify from "slugify";
import AnchorLink from "react-anchor-link-smooth-scroll";
import { filterGpProduct } from "../../utils/filtersPromotion";

// Constantes para cache
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutos em ms
const CACHE_KEY_PREFIX = "menu_dallas_categories_";

function MenuOptionsStore({ data, categories, products, getAll, subdomain }) {
  const [isLoading, setIsLoading] = useState(true);
  const [categoriesData, setCategoriesData] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [active, setActive] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const sliderRef = useRef(null);
  const initializedRef = useRef(false);
  const cacheKey = `${CACHE_KEY_PREFIX}${data?.user_id}`;

  // Configuração do slider
  const options = {
    initial: 0,
    slides: {
      perView: 2,
      spacing: 28,
    },
    breakpoints: {
      "(max-width: 768px)": {
        slides: {
          perView: 3,
          spacing: 2,
        },
      },
      "(min-width: 769px) and (max-width: 1500px)": {
        slides: {
          perView: 5,
          spacing: 28,
        },
      },
      "(min-width: 1501px) and (max-width: 1920px)": {
        slides: {
          perView: 7,
          spacing: 28,
        },
      },
      "(min-width: 1921px) and (max-width: 3000px)": {
        slides: {
          perView: 10,
          spacing: 28,
        },
      },
    },
    created() {
      setLoaded(true);
    },
  };

  // Inicializar o slider apenas quando os dados estiverem prontos
  const [sliderElement, keenSlider] = useKeenSlider(options, [
    (slider) => {
      sliderRef.current = slider;
    },
  ]);

  // Tenta carregar os dados do cache primeiro
  useEffect(() => {
    const loadCachedData = () => {
      try {
        if (typeof window !== "undefined") {
          const cachedDataStr = localStorage.getItem(cacheKey);
          if (cachedDataStr) {
            const { data: cachedData, timestamp } = JSON.parse(cachedDataStr);

            // Se o cache não expirou, use os dados
            if (Date.now() - timestamp < CACHE_DURATION) {
              setCategoriesData(cachedData);
              setIsLoading(false);
              return true;
            }
          }
        }
      } catch (error) {
        console.error("Error loading cached categories:", error);
      }
      return false;
    };

    // Se não conseguiu carregar do cache, busque os dados
    const hasLoadedFromCache = loadCachedData();

    if (!hasLoadedFromCache && !initializedRef.current) {
      initializedRef.current = true;
      getAll(data.user_id);
    }

    // Configurar evento de scroll
    const handleScroll = () => {
      let header_height = document.getElementById("header")?.clientHeight || 0;
      let header_ref = document.getElementById("ref")?.offsetTop || 0;
      let yOffset = document.documentElement.scrollTop + 60;

      const header = document.getElementById("header");
      const ref = document.getElementById("ref");

      if (header && yOffset >= header_height) {
        header.classList.add("minimized");
      } else if (header) {
        header.classList.remove("minimized");
      }

      if (ref && yOffset >= header_ref) {
        ref.classList.add("minimized");
      } else if (ref) {
        ref.classList.remove("minimized");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [data.user_id, getAll, cacheKey]);

  // Processar dados de categorias do Redux e atualizar cache
  useEffect(() => {
    if (categories.items) {
      setCategoriesData(categories.items);
      setIsLoading(false);

      // Atualizar cache
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem(
            cacheKey,
            JSON.stringify({
              data: categories.items,
              timestamp: Date.now(),
            })
          );
        }
      } catch (error) {
        console.error("Error caching categories data:", error);
      }
    }

    if (categories.loading !== undefined) {
      setIsLoading(categories.loading);
    }
  }, [categories, cacheKey]);

  // Processar produtos
  useEffect(() => {
    if (products.items) {
      setProductsData(products.items);
    } else {
      setProductsData([]);
    }
  }, [products]);

  // Atualizar o slider quando os dados estiverem prontos
  useEffect(() => {
    if (loaded && sliderRef.current && categoriesData.length > 0) {
      setTimeout(() => {
        sliderRef.current.update();
      }, 50);
    }
  }, [loaded, categoriesData]);

  // Renderizar skeletons durante o carregamento
  const renderSkeletons = () => {
    return (
      <Flex width="100%" justifyContent="flex-start" gap="12px">
        {Array.from({ length: isMobile ? 3 : 5 }).map((_, i) => (
          <Skeleton
            key={i}
            height="42px"
            width="110px"
            startColor="gray.100"
            endColor="gray.200"
            borderRadius="full"
          />
        ))}
      </Flex>
    );
  };

  return (
    <Box className="page-center menu-card">
      <Box
        id="ref"
        w="100%"
        bg="white"
        display="flex"
        padding={["12px 16px", "16px 24px"]}
        alignItems="center"
        justifyContent="flex-start"
        borderRadius="16px"
        css={`
          &.minimized {
            position: fixed;
            top: ${isMobile ? "16px" : "24px"};
            left: 0;
            right: 0;
            z-index: 8;
            padding: 12px 20px;
            box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.08);
          }
        `}
      >
        {isLoading ? (
          renderSkeletons()
        ) : (
          <Box
            ref={sliderElement}
            className="keen-slider chips"
            alignItems="center"
            width="100%"
            visibility={loaded ? "visible" : "hidden"}
          >
            {categoriesData.map(
              (item, key) =>
                (!productsData.length ||
                  productsData?.filter((entry) => filterGpProduct(entry, item))
                    .length > 0) && (
                  <Box className="keen-slider__slide" key={key}>
                    <AnchorLink
                      offset="220"
                      href={"#" + slugify(item.descricao, { lower: true })}
                      onClick={() => setActive(item.id_grupo)}
                    >
                      <Button
                        className={`chip ${
                          active == item.id_grupo ? "chip--active" : ""
                        }`}
                        borderRadius="999px"
                        h="44px"
                        px="20px"
                        fontSize="14px"
                        fontWeight={600}
                        bg={
                          active == item.id_grupo
                            ? data?.primary_color || "#F59E0B"
                            : "transparent"
                        }
                        color={active == item.id_grupo ? "white" : "#6B7280"}
                        border="none"
                        boxShadow="none"
                        transition="all 0.2s ease"
                        _hover={{
                          bg:
                            active == item.id_grupo
                              ? data?.primary_color || "#F59E0B"
                              : "#F8FAFC",
                          color: active == item.id_grupo ? "white" : "#374151",
                        }}
                        _active={{
                          transform: "scale(0.98)",
                        }}
                      >
                        {item.descricao}
                      </Button>
                    </AnchorLink>
                  </Box>
                )
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}

function mapState(state) {
  const { categories, products } = state;
  return { categories, products };
}

const actionCreators = {
  getAll: categoriesActions.getAll,
};

export default connect(mapState, actionCreators)(MenuOptionsStore);
