import {
  Box,
  Button,
  Flex,
  Skeleton,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useKeenSlider } from "keen-slider/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
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
  const initializedRef = useRef(false);
  const cacheKey = `${CACHE_KEY_PREFIX}${data?.user_id}`;
  const scrollKey = `${cacheKey}_scroll`;
  const chipsContainerRef = useRef(null);

  // Configuração do slider
  const options = {
    renderMode: "basic",
    rubberband: false,
    slides: {
      perView: "auto",
      spacing: 8, // chips mais próximos
    },
    created() {
      setLoaded(true);
    },
  };

  // Inicializar o slider apenas quando os dados estiverem prontos
  const [sliderElement, keenSlider] = useKeenSlider(options);
  const attachSliderRef = useCallback(
    (node) => {
      chipsContainerRef.current = node || null;
      sliderElement(node);
    },
    [sliderElement]
  );

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
    if (loaded && keenSlider && keenSlider.current) {
      keenSlider.current.update();
    }
  }, [loaded, categoriesData, keenSlider]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const node = chipsContainerRef.current;
    if (!node) return;

    const stored = sessionStorage.getItem(scrollKey);
    if (stored) {
      node.scrollLeft = Number(stored);
    }

    const handleScroll = () =>
      sessionStorage.setItem(scrollKey, node.scrollLeft.toString());

    node.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      node.removeEventListener("scroll", handleScroll);
      sessionStorage.setItem(scrollKey, node.scrollLeft.toString());
    };
  }, [scrollKey, loaded]);

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
    <Box className="page-center">
      <Box className="menu-card">
        <Box
          id="ref"
          w="100%"
          bg="transparent"
          display="flex"
          padding={0}
          alignItems="center"
          justifyContent="flex-start"
          borderRadius={0}
          css={`
            position: static !important;
            background: transparent !important;
            box-shadow: none !important;
            border-radius: 0 !important;

            &.minimized {
              position: static !important;
              top: auto !important;
              left: auto !important;
              right: auto !important;
              padding: 0 !important;
              box-shadow: none !important;
            }
          `}
        >
          {isLoading ? (
            renderSkeletons()
          ) : (
            <Box
              ref={attachSliderRef}
              className="keen-slider chips"
              alignItems="center"
              width="100%"
              visibility={loaded ? "visible" : "hidden"}
            >
              {categoriesData.map(
                (item, key) =>
                  (!productsData.length ||
                    productsData?.filter((entry) =>
                      filterGpProduct(entry, item)
                    ).length > 0) && (
                    <Box className="keen-slider__slide" key={key}>
                      <AnchorLink
                        offset="220"
                        href={"#" + slugify(item.descricao, { lower: true })}
                        onClick={() => setActive(item.id_grupo)}
                      >
                        <Button
                          className={`menu-chip chip ${
                            active == item.id_grupo ? "chip--active" : ""
                          }`}
                          size="sm"
                          h="28px"
                          px="3"
                          rounded="full"
                          fontSize="xs"
                          fontWeight="500"
                          variant="outline"
                          borderColor="gray.200"
                          _hover={{ bg: "gray.50" }}
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
