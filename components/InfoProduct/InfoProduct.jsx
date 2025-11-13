import {
  Box,
  Button,
  Checkbox,
  Container,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Icon,
  Input,
  Radio,
  Stack,
  Switch,
  Tag,
  Text,
  Textarea,
  VStack,
  Divider,
  UnorderedList,
  ListItem,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import { isEmpty } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { getOpened } from "../../utils/getOpened";
import { moneyFormat } from "../../utils/moneyFormat";
import { connect } from "react-redux";
import { saboresActions } from "../../store/actions";
import { Loading } from "../Loading";
import { FiCheck, FiSearch, FiInfo, FiChevronDown } from "react-icons/fi";
import { MdClose } from "react-icons/md";
import { FooterProduct } from "../FooterProduct";
import { addCart } from "../../utils/addCart";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import Image from "next/image";
import styles from "./InfoProduct.module.css";
import CartModal from "../CartModal/CartModal";

function InfoProduct({ subdomain, data, productData, sabores, getAll }) {
  const toast = useToast();
  const [dt, setData] = useState({});
  const [productDetail, setProductDetail] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalUnity, setTotalUnity] = useState(0);
  const [count, setCount] = useState(1);
  const [disable, setDisable] = useState(true);
  const [opened, setOpened] = useState(false);
  const [length, setLength] = useState(undefined);
  const [lengthObject, setLengthObject] = useState({});
  const [flavors, setFlavors] = useState([]);
  const [flavorsFilters, setFlavorsFilters] = useState([]);
  const [flavorsSelected, setFlavorsSelected] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [gpAdicionais, setGpAdicionais] = useState([]);
  const [gpTamanhos, setGpTamanhos] = useState([]);
  const [observacaoItem, setObservacaoItem] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchFlavors, setSearchFlavors] = useState(false);
  const [searchTermFlavor, setSearchTermFlavor] = useState("");
  const [expandedGroups, setExpandedGroups] = useState({});
  const {
    isOpen: isCartOpen,
    onOpen: onCartOpen,
    onClose: onCartClose,
  } = useDisclosure();
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // Add page-product class to body for styling isolation
    document.body.classList.add("page-product");

    // Cleanup function to remove class when component unmounts
    return () => {
      document.body.classList.remove("page-product");
    };
  }, []);

  // Load cart items from localStorage
  useEffect(() => {
    const loadCart = () => {
      const bag = localStorage.getItem("@menu-digital:" + subdomain + ":bag");
      if (bag) {
        const items = JSON.parse(bag);
        setCartItems(items);
        // Calculate total
        const total = items.reduce((sum, item) => sum + item.valor_total, 0);
        setCartTotal(total);
      }
    };

    loadCart();
    // Reload cart periodically to keep it updated
    const interval = setInterval(loadCart, 1000);
    return () => clearInterval(interval);
  }, [subdomain]);

  // Listen for openCart event from NavbarProduct
  useEffect(() => {
    const handleOpenCart = () => {
      onCartOpen();
    };

    window.addEventListener("openCart", handleOpenCart);
    return () => window.removeEventListener("openCart", handleOpenCart);
  }, [onCartOpen]);

  useEffect(() => {
    if (!isEmpty(productData)) {
      var dtFinal = productData[0];

      setOpened(getOpened(data));

      var gpArrayAdicionais = dtFinal.grupo_adicional;

      if (gpArrayAdicionais.length > 0) {
        dtFinal.grupo_adicional = dtFinal.grupo_adicional.map((item) => ({
          ...item,
          selected_index: [],
        }));

        setGpAdicionais(dtFinal.grupo_adicional);
      }

      setData(dtFinal);

      var gpArrayTamanhos = dtFinal.tamanhos;

      if (gpArrayTamanhos && gpArrayTamanhos.length > 0) {
        setGpTamanhos(gpArrayTamanhos);
      }

      setProductDetail(dtFinal);
      window.scrollTo(0, 0);
    }
  }, [productData]);

  const getTotal = useCallback(() => {
    let v =
      dt.em_promocao == true
        ? dt.valor_Promocao !== undefined
          ? dt.valor_Promocao
          : 0
        : dt.valor !== undefined
        ? dt.valor
        : 0;
    let storage = data;

    if (
      storage.regra_valor_montagem &&
      storage.regra_valor_montagem === "MAIOR"
    ) {
      if (gpTamanhos !== undefined) {
        if (lengthObject.valor > v) {
          v = lengthObject.valor;
        }

        if (flavorsSelected.length > 0) {
          if (flavorsSelected)
            flavorsSelected.forEach((element) => {
              if (element.valor > v) {
                v = element.valor;
              }
            });
        }
      }
    }

    if (
      storage.regra_valor_montagem &&
      storage.regra_valor_montagem === "MEDIA"
    ) {
      if (gpTamanhos !== undefined) {
        let sum = lengthObject.valor;

        if (flavorsSelected.length > 0) {
          flavorsSelected.forEach((element) => {
            sum = sum + element.valor;
          });
        }

        v = v + sum / (flavorsSelected.length + 1);
      }
    }

    if (productDetail.length > 0) {
      productDetail.forEach((element) => {
        var elementTwo = element[Object.keys(element)[0]];

        elementTwo.forEach((item) => {
          item.selected_index.forEach((row) => {
            v = v + row.valor;
          });
        });
      });
    }

    if (gpAdicionais.length > 0) {
      let adc = [];

      var tAdicional = 0;

      gpAdicionais.forEach((element) => {
        element.selected_index.forEach((item) => {
          tAdicional += item.valor;

          adc.push({
            ...item,
            quantidade: count,
          });
        });
      });

      v += tAdicional;
    }

    setTotalUnity(v);
    setTotal(v * count);
  }, [productDetail, count, lengthObject, flavorsSelected, gpAdicionais]);

  const handleLength = async (tam) => {
    setIsLoading(true);
    getAll(data.user_id, tam, dt.id_grupo);
  };

  const getDisable = useCallback(() => {
    let cont = 0;
    if (productDetail.length > 0) {
      if (gpAdicionais.length > 0) {
        gpAdicionais.forEach((element) => {
          if (element.selected_index.length < element.qtd_minimo) {
            cont = cont + 1;
          }
        });
      }
    }

    if (cont === 0) {
      if (gpTamanhos.length > 0 && length === undefined) {
        setDisable(true);
      } else {
        setDisable(false);
      }
    } else {
      setDisable(true);
    }
  }, [productDetail, dt, length]);

  useEffect(() => {
    getTotal();
    getDisable();
  }, [getTotal, productDetail, getDisable]);

  useEffect(() => {
    if (sabores.items) {
      let find = sabores.items.filter(
        (filter) => dt.descricao && dt.descricao.includes(filter.descricao)
      );

      if (find.length > 0) {
        let flavs = find;
        setFlavorsSelected(flavs);
      }

      setFlavors(sabores.items);
      setFlavorsFilters(sabores.items);

      setIsLoading(false);
    } else {
      setFlavors([]);
      setFlavorsFilters([]);
    }

    if (sabores.loading) {
      setIsLoading(sabores.loading);
    }
  }, [sabores]);

  const handleItemOrder = () => {
    Swal.fire({
      title: "Adicionar ao carrinho",
      text: "Deseja realmente adicionar este item ao carrinho?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sim, adicionar",
      cancelButtonText: "Cancelar",
      buttonsStyling: false,
      customClass: {
        popup: "md-popup",
        title: "md-title",
        htmlContainer: "md-body",
        actions: "md-actions",
        confirmButton: "md-btn md-btn--confirm",
        cancelButton: "md-btn md-btn--cancel",
        icon: "md-icon",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        let product = {
          id: dt.id_produto,
          descricao: dt.descricao,
          unidade: dt.unidade,
          tipo: dt.tipo,
          editado: dt.custom,
          quantidade: count,
          tag: dt.tag ? dt.tag : dt.tag,
          valor:
            dt.em_promocao == false || dt.em_promocao == undefined
              ? dt.valor !== undefined
                ? dt.valor
                : 0
              : dt.valor_Promocao !== undefined
              ? dt.valor_Promocao
              : 0,
          valor_total: totalUnity,
          // Corrige: salvar o total da linha (preço unitário × quantidade)
          valor_total: totalUnity * count,
          observacao_item: observacaoItem,
          foto_destaque: dt.foto_destaque,
          id_grupo: dt.id_grupo,
        };

        if (gpAdicionais.length > 0) {
          let adc = [];

          var tAdicional = 0;

          gpAdicionais.forEach((element) => {
            element.selected_index.forEach((item) => {
              tAdicional = item.valor * count + tAdicional;

              adc.push({
                ...item,
                quantidade: count,
              });
            });
          });

          product.total_adicional = tAdicional;
          product.adicional = adc;
        }

        if (flavorsSelected.length > 0) {
          product.sabores = flavorsSelected;
        }

        if (lengthObject != undefined) {
          product.tamanho = lengthObject;
        }

        addCart(product, subdomain);
        // Recarregar o carrinho do localStorage
        const bag = localStorage.getItem("@menu-digital:" + subdomain + ":bag");
        if (bag) {
          const items = JSON.parse(bag);
          setCartItems(items);
          const total = items.reduce((sum, item) => sum + item.valor_total, 0);
          setCartTotal(total);
        }
        // Abrir a sacola após adicionar
        setTimeout(() => {
          onCartOpen();
        }, 300);
      }
    });
  };

  const filterPromotionTamanhoArrayMenor = (tamanho) => {
    let arrayValores = [];

    if (tamanho.valor_g_promocao != undefined) {
      arrayValores.push(tamanho.valor_g_promocao);
    } else {
      if (tamanho.valor_g != undefined) {
        arrayValores.push(tamanho.valor_g);
      }
    }

    if (tamanho.valor_m_promocao != undefined) {
      arrayValores.push(tamanho.valor_m_promocao);
    } else {
      if (tamanho.valor_m != undefined) {
        arrayValores.push(tamanho.valor_m);
      }
    }

    if (tamanho.valor_p_promocao != undefined) {
      arrayValores.push(tamanho.valor_p_promocao);
    } else {
      if (tamanho.valor_p != undefined) {
        arrayValores.push(tamanho.valor_p);
      }
    }

    return Math.min(...arrayValores);
  };

  const filterPromotionTamanhoArrayMaior = (tamanho) => {
    let arrayValores = [];

    if (tamanho.valor_g_promocao != undefined) {
      arrayValores.push(tamanho.valor_g_promocao);
    } else {
      if (tamanho.valor_g != undefined) {
        arrayValores.push(tamanho.valor_g);
      }
    }

    if (tamanho.valor_m_promocao != undefined) {
      arrayValores.push(tamanho.valor_m_promocao);
    } else {
      if (tamanho.valor_m != undefined) {
        arrayValores.push(tamanho.valor_m);
      }
    }

    if (tamanho.valor_p_promocao != undefined) {
      arrayValores.push(tamanho.valor_p_promocao);
    } else {
      if (tamanho.valor_p != undefined) {
        arrayValores.push(tamanho.valor_p);
      }
    }

    return Math.max(...arrayValores);
  };

  const handleFilterProducts = (e) => {
    const searchString = e.target.value.toLowerCase();
    setSearchTermFlavor(e.target.value);

    const filteredFlavors = flavors.filter((flavor) => {
      const flavorDescricao = flavor.descricao.toLowerCase();
      return flavorDescricao.includes(searchString);
    });

    setFlavorsFilters(filteredFlavors);
  };

  const handleSwitchChange = (itemIndex, addIndex) => {
    setGpAdicionais((prevState) => {
      const newState = [...prevState];
      const item = newState[itemIndex];
      const add = item.adicionais[addIndex];

      if (item.selected_index.includes(add)) {
        item.selected_index = item.selected_index.filter((i) => i !== add);
      } else {
        item.selected_index.push(add);
      }

      return newState;
    });
  };

  const handleDecreaseCount = () => {
    if (count > 1) {
      const newValue = count - 1;
      setCount(newValue);
      setTotal(totalUnity * newValue);
    }
  };

  const handleIncreaseCount = () => {
    const newValue = count + 1;
    setCount(newValue);
    setTotal(totalUnity * newValue);
  };

  const ingredientsList = React.useMemo(() => {
    const normalize = (value) =>
      value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

    if (Array.isArray(dt?.ingredientes)) {
      return dt.ingredientes;
    }

    if (typeof dt?.ingredientes === "string") {
      return normalize(dt.ingredientes);
    }

    if (Array.isArray(dt?.ingrediente)) {
      return dt.ingrediente;
    }

    if (typeof dt?.ingrediente === "string") {
      return normalize(dt.ingrediente);
    }

    return [];
  }, [dt?.ingrediente, dt?.ingredientes]);

  const isRangeProduct = ["P", "O"].includes(dt?.tipo);
  const hasPromotion = !isRangeProduct && dt?.em_promocao == true;

  return (
    <Box
      as="main"
      bg="gray.50"
      minH="100vh"
      position="relative"
      id="product-page"
    >
      {/* HERO IMAGE - 40-45% da tela */}
      <Box
        position="relative"
        w="100%"
        h={{ base: "45vh", md: "50vh" }}
        overflow="hidden"
        bg="#F5F5F5"
        borderBottomRadius="2xl"
      >
        {/* Background Image */}
        <Image
          src={dt?.foto_destaque || "/placeholder.png"}
          alt={dt?.descricao || "Produto"}
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
          sizes="100vw"
          priority
          loader={({ src }) => src}
        />

        {/* Gradient Overlay - Sutil no topo para legibilidade dos botões */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bgGradient="linear(to-b, rgba(0,0,0,0.3) 0%, transparent 30%, transparent 60%, rgba(255,255,255,0.8) 100%)"
          zIndex={1}
        />
      </Box>

      {/* MAIN CARD - Painel branco com cantos arredondados no topo */}
      <Box
        bg="white"
        borderTopRadius="2xl"
        mt="-6"
        p={6}
        position="relative"
        zIndex={5}
        boxShadow="sm"
        maxW={{ base: "100%", md: "600px" }}
        mx={{ base: 0, md: "auto" }}
        px={4}
        pb="120px"
      >
        {/* Store Info Header */}
        <Flex align="center" gap={3} mb={2}>
          <Image
            src={
              data?.logo_home ||
              "https://imgmenudallas.s3.sa-east-1.amazonaws.com/noimage.png"
            }
            alt={data?.nome || "Logo da loja"}
            width={24}
            height={24}
            style={{ borderRadius: "4px", objectFit: "cover" }}
            loader={({ src }) => src}
          />
          <Text color="gray.500" fontSize="sm">
            {data?.nome || "Estabelecimento"}
          </Text>
        </Flex>

        {/* Product Title */}
        <Text fontWeight="bold" fontSize="xl" color="#212121" mb={2}>
          {dt?.descricao}
        </Text>

        {/* Price Row */}
        <Flex className="priceRow" align="center" my={4}>
          <Text fontWeight="bold" fontSize="lg" color="#212121">
            {moneyFormat.format(totalUnity || 0)}
          </Text>

          {/* Quantity Stepper */}
          <Box className="quantity" role="group" aria-label="Quantidade">
            <Box
              as="button"
              type="button"
              className="qty-btn qty-btn--minus"
              aria-label="Diminuir"
              onClick={handleDecreaseCount}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="0.5"
                  y="0.5"
                  width="31"
                  height="31"
                  rx="9.5"
                  stroke="#EEEEEE"
                />
                <path
                  d="M18 20L14 16L18 12"
                  stroke="#323232"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Box>

            <Text className="qty-value">{count}</Text>

            <Box
              as="button"
              type="button"
              className="qty-btn qty-btn--plus"
              aria-label="Aumentar"
              onClick={handleIncreaseCount}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="32" height="32" rx="10" fill="#D52B1E" />
                <path
                  d="M14 20L18 16L14 12"
                  stroke="white"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Box>
          </Box>
        </Flex>

        {/* About Section */}
        <Box mt={4} mb={5}>
          <Text fontWeight="bold" fontSize="md" color="#212121" mb={2}>
            Sobre
          </Text>
          <Text fontSize="sm" color="gray.600" lineHeight="1.5">
            {dt?.detalhe ||
              "Esse produto está pronto para deixar o seu pedido ainda mais especial."}
          </Text>
        </Box>

        {/* Ingredientes Section */}
        {ingredientsList.length > 0 && (
          <Box mt={5} mb={6}>
            <Flex align="center" gap={2} mb={2}>
              <Icon as={FiInfo} fontSize="16px" color="#212121" />
              <Text fontWeight="bold" fontSize="md" color="#212121">
                Ingredientes
              </Text>
            </Flex>
            <UnorderedList spacing={1} mt={2} color="gray.600" fontSize="sm">
              {ingredientsList.map((item, index) => (
                <ListItem key={`${item}-${index}`}>{item}</ListItem>
              ))}
            </UnorderedList>
          </Box>
        )}

        {/* Additional Content - Sem cards coloridos */}
        <Box
          className="additional-content"
          bg="transparent"
          shadow="none"
          border="none"
          p={0}
          m={0}
        >
          <Stack spacing={10}>
            <Box>
              {dt.tag && (
                <Tag
                  mb="4"
                  bg={data?.primary_color || "#F59E0B"}
                  color="white"
                  borderRadius="full"
                  px="14px"
                  py="4px"
                  fontWeight={600}
                >
                  {dt.tag}
                </Tag>
              )}

              {isRangeProduct && (
                <Text fontSize="sm" color="#6B7280" mb="2">
                  De {moneyFormat.format(dt?.valor_de || 0)} até{" "}
                  {moneyFormat.format(dt?.valor_ate || 0)}
                </Text>
              )}
              {hasPromotion && (
                <Text
                  fontSize="sm"
                  color="#9CA3AF"
                  textDecoration="line-through"
                  mb="2"
                >
                  {moneyFormat.format(dt?.valor || 0)}
                </Text>
              )}
              {/* Total removido da página de produto */}
              {/* {count > 1 && (
                <Text fontSize="sm" color="#6B7280" mb="2">
                  Total: {moneyFormat.format(total || 0)}
                </Text>
              )} */}
            </Box>

            {/* Removido o Divider para evitar a linha extra ao adicionar item */}

            {gpTamanhos.length > 0 && (
              <Box
                bg="transparent"
                border="none"
                borderRadius="0"
                overflow="visible"
                mt={4}
              >
                <Flex
                  w="100%"
                  p={0}
                  alignItems="center"
                  justifyContent="space-between"
                  bg="transparent"
                  borderBottom="1px solid #E5E7EB"
                  mb={2}
                  pb={2}
                >
                  <Text fontSize="14px" fontWeight={700} color="#111827" textTransform="uppercase" fontFamily="var(--font-poppins), system-ui, -apple-system, sans-serif">
                    Tamanho
                  </Text>
                  <Box
                    bg="#F3F4F6"
                    borderRadius="999px"
                    px="14px"
                    py="6px"
                    fontSize="12px"
                    fontWeight={600}
                    color="#323232"
                  >
                    Obrigatório
                  </Box>
                </Flex>

                {gpTamanhos.map((tam, index) => (
                  <Flex
                    key={index}
                    w="100%"
                    borderBottom={
                      index + 1 === gpTamanhos.length
                        ? "none"
                        : "1px solid #E5E7EB"
                    }
                    padding={0}
                    py={3}
                    alignItems="center"
                    justifyContent="space-between"
                    flexWrap="wrap"
                  >
                    <Box>
                      <Text
                        fontFamily="var(--font-poppins), system-ui, -apple-system, sans-serif"
                        fontSize="16px"
                        fontWeight={700}
                        color="#111827"
                        display="inline"
                        mr="6px"
                      >
                        {tam?.tamanho}
                      </Text>
                      <Text as="span" fontSize="12px" color="#6B7280">
                        (Até {tam?.qtd_sabor} {tam?.qtd_sabor === 1 ? "sabor" : "sabores"})
                      </Text>
                    </Box>

                    <Box mt={["12px", "0"]}>
                      <Checkbox
                        isChecked={length == index}
                        onChange={() => {
                          if (tam.tamanho !== lengthObject.tamanho) {
                            setFlavorsSelected([]);
                            handleLength(tam?.tamanho);
                          }
                          setLength(index);
                          setLengthObject(tam);
                          setOpenModal(true);
                        }}
                        size="lg"
                        sx={{
                          ".chakra-checkbox__control": {
                            w: "20px",
                            h: "20px",
                            borderRadius: "6px",
                            borderWidth: "2px",
                            borderColor:
                              length == index
                                ? data?.primary_color || "#CF3F2E"
                                : "gray.300",
                            bg:
                              length == index
                                ? data?.primary_color || "#CF3F2E"
                                : "white",
                            transition: "all .15s ease",
                            boxShadow:
                              length == index
                                ? "0 2px 6px rgba(207, 63, 46, .25)"
                                : "none",
                          },
                        }}
                      />
                    </Box>
                  </Flex>
                ))}

                <Drawer
                  placement="bottom"
                  onClose={() => setOpenModal(false)}
                  isOpen={openModal}
                >
                  <DrawerOverlay />
                  <DrawerContent borderRadius="32px 32px 0 0" maxH="85vh">
                    <DrawerHeader
                      position="relative"
                      borderBottomWidth="1px"
                      textAlign="center"
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Box display={searchFlavors ? "block" : "none"} w="80%">
                        <Input
                          name="name"
                          type="search"
                          value={searchTermFlavor}
                          float="left"
                          fontSize="sm"
                          onChange={(e) => handleFilterProducts(e)}
                          onKeyPress={(e) => handleFilterProducts(e)}
                          placeholder="Digite para filtrar por um sabor"
                        />
                      </Box>

                      {!searchFlavors && (
                        <Text color={data?.primary_color}>Sabores</Text>
                      )}

                      <Button
                        onClick={() => {
                          setFlavorsFilters(flavors);
                          setSearchTermFlavor("");
                          setSearchFlavors(!searchFlavors);
                        }}
                        variant="transparent"
                      >
                        <Icon as={FiSearch} />
                      </Button>
                    </DrawerHeader>
                    <DrawerBody overflowY="auto">
                      {!searchFlavors && (
                        <>
                          <Box w="100%" p="20px 25px 0" textAlign="center">
                            <Text
                              fontSize="14px"
                              fontWeight={700}
                              color="#111827"
                              textTransform="uppercase"
                              fontFamily="var(--font-poppins), system-ui, -apple-system, sans-serif"
                            >
                              Sabores disponíveis para esse tamanho
                            </Text>
                            <Text
                              fontSize="12px"
                              color="#6B7280"
                              fontFamily="var(--font-poppins), system-ui, -apple-system, sans-serif"
                            >
                              Escolha no mínimo 1 opção
                            </Text>
                            <Flex justifyContent="center" mt="12px" gap="12px">
                              <Box
                                bg={data?.primary_color}
                                borderRadius="5px"
                                padding="8px 14px"
                                fontSize="12px"
                                fontWeight={600}
                                color="#fff"
                              >
                                {flavorsSelected.length} / {lengthObject.qtd_sabor}
                              </Box>
                              <Box
                                bg="#F3F4F6"
                                borderRadius="999px"
                                padding="8px 14px"
                                fontSize="12px"
                                fontWeight={600}
                                color="#323232"
                              >
                                Obrigatório
                              </Box>
                            </Flex>
                          </Box>

                          <Box p="10px 25px 25px" overflowY="auto" maxH="650px">
                            <Box>
                              <Text
                                fontSize="14px"
                                fontWeight={700}
                                color="#111827"
                                textTransform="uppercase"
                                fontFamily="var(--font-poppins), system-ui, -apple-system, sans-serif"
                                textAlign="center"
                              >
                                Faça sua escolha de sabores
                              </Text>
                              <Text
                                fontSize="12px"
                                color="#6B7280"
                                mb="10px"
                                fontFamily="var(--font-poppins), system-ui, -apple-system, sans-serif"
                                textAlign="center"
                              >
                                Escolha até {lengthObject.qtd_sabor} opç
                                {lengthObject.qtd_sabor > 1 ? "ões" : "ão"}
                              </Text>

                              <VStack spacing="10px" p="0" w="100%">
                                {flavorsFilters.map((sab, index) => {
                                  const isSelected =
                                    flavorsSelected.filter(
                                      (filter) =>
                                        filter.id_sabor == sab.id_sabor
                                    ).length > 0;

                                  return (
                                    <Box key={index} w="100%">
                                      <Flex
                                        alignItems="center"
                                        justifyContent="space-between"
                                        gap="12px"
                                        h="48px"
                                        px="16px"
                                        border="1px solid"
                                        borderColor="gray.200"
                                        borderRadius="12px"
                                        bg="white"
                                        _hover={{
                                          borderColor: "gray.300",
                                          bg: "gray.50",
                                        }}
                                      >
                                        <Box>
                                          <Text
                                            fontFamily="var(--font-poppins), system-ui, -apple-system, sans-serif"
                                            fontWeight={400}
                                            color="gray.900"
                                            fontSize="12px"
                                            lineHeight="18px"
                                          >
                                            {sab?.descricao}
                                          </Text>
                                        </Box>

                                        <Flex align="center" gap="12px">
                                          <Text
                                            fontFamily="var(--font-poppins), system-ui, -apple-system, sans-serif"
                                            fontWeight={600}
                                            color="gray.800"
                                            fontSize="14px"
                                          >
                                            {moneyFormat.format(sab?.valor)}
                                          </Text>
                                          <Checkbox
                                            isChecked={isSelected}
                                            onChange={(e) => {
                                              let dt = flavorsSelected;
                                              if (
                                                lengthObject.qtd_sabor === 0
                                              ) {
                                                if (
                                                  flavorsSelected.find(
                                                    (filter) => filter === sab
                                                  ) !== undefined
                                                ) {
                                                  if (
                                                    sab.descricao !==
                                                    dt.descricao
                                                  ) {
                                                    let ind = dt.indexOf(sab);
                                                    dt.splice(ind, 1);
                                                  }
                                                } else {
                                                  dt.push(sab);
                                                }
                                              } else {
                                                if (
                                                  dt.length <
                                                  lengthObject.qtd_sabor
                                                ) {
                                                  if (
                                                    flavorsSelected.find(
                                                      (filter) => filter === sab
                                                    ) !== undefined
                                                  ) {
                                                    if (
                                                      sab.descricao !==
                                                      dt.descricao
                                                    ) {
                                                      let ind = dt.indexOf(sab);
                                                      dt.splice(ind, 1);
                                                    }
                                                  } else {
                                                    dt.push(sab);
                                                  }
                                                } else {
                                                  if (
                                                    flavorsSelected.find(
                                                      (filter) => filter === sab
                                                    ) !== undefined
                                                  ) {
                                                    if (
                                                      sab.descricao !==
                                                      dt.descricao
                                                    ) {
                                                      let ind = dt.indexOf(sab);
                                                      dt.splice(ind, 1);
                                                    }
                                                  }
                                                }
                                              }

                                              setFlavorsSelected([...dt]);
                                            }}
                                            sx={{
                                              ".chakra-checkbox__control": {
                                                w: "20px",
                                                h: "20px",
                                                borderRadius: "6px",
                                                borderWidth: "2px",
                                                borderColor: isSelected
                                                  ? data?.primary_color ||
                                                    "#CF3F2E"
                                                  : "gray.300",
                                                bg: isSelected
                                                  ? data?.primary_color ||
                                                    "#CF3F2E"
                                                  : "white",
                                                transition: "all .15s ease",
                                                boxShadow: isSelected
                                                  ? "0 2px 6px rgba(207, 63, 46, .25)"
                                                  : "none",
                                              },
                                            }}
                                          />
                                        </Flex>
                                      </Flex>

                                      {isSelected && (
                                        <Textarea
                                          mt="8px"
                                          placeholder="Escreva a observação aqui..."
                                          size={["xs", "xs"]}
                                          border="1px solid #E0E0E0"
                                          borderRadius="36.5px"
                                          padding="11px 25px"
                                          value={
                                            flavorsSelected.find(
                                              (filter) =>
                                                filter.id_sabor == sab.id_sabor
                                            )?.observacao
                                          }
                                          onChange={(e) => {
                                            setFlavorsSelected(
                                              (prevFlavors) => {
                                                return prevFlavors.map(
                                                  (flavor) => {
                                                    if (
                                                      flavor.id_sabor ===
                                                      sab.id_sabor
                                                    ) {
                                                      return {
                                                        ...flavor,
                                                        observacao:
                                                          e.target.value,
                                                      };
                                                    }
                                                    return flavor;
                                                  }
                                                );
                                              }
                                            );
                                          }}
                                          resize="none"
                                          _focusVisible={{
                                            borderColor: data?.primary_color,
                                            boxShadow: `0 0 0 1px ${data?.primary_color}`,
                                          }}
                                          rows="1"
                                          maxLength={140}
                                          overflow="hidden"
                                        />
                                      )}
                                    </Box>
                                  );
                                })}
                              </VStack>
                            </Box>
                          </Box>
                        </>
                      )}
                    </DrawerBody>
                    <DrawerFooter>
                      <Button
                        variant="transparent"
                        color="white"
                        bg={data?.primary_color}
                        transition="0.3s"
                        _hover={{
                          opacity: 0.8,
                        }}
                        w="100%"
                        onClick={() => {
                          setOpenModal(false);
                          window.scrollTo(0, 0);
                        }}
                      >
                        Salvar
                      </Button>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              </Box>
            )}

            {flavorsSelected && flavorsSelected.length ? (
              <Box
                borderRadius="32px"
                border="1px solid #E5E7EB"
                bg="#FFFFFF"
                overflow="hidden"
              >
                <Flex
                  flexWrap={["wrap", "initial"]}
                  w="100%"
                  p={["20px", "28px"]}
                  alignItems="center"
                  justifyContent="space-between"
                  bg="#FDFDFD"
                >
                  <Box textAlign={["center", "initial"]} w={["100%", "60%"]}>
                    <Text fontSize="lg" fontWeight={700}>
                      Sabores escolhidos
                    </Text>
                  </Box>

                  <Flex
                    w={["100%", "auto"]}
                    justifyContent={["center", "flex-end"]}
                    mt={["16px", "0"]}
                  >
                    <Box
                      bg={data?.primary_color || "#F59E0B"}
                      borderRadius="full"
                      padding="10px 22px"
                      fontSize="14px"
                      fontWeight={700}
                      color="#fff"
                    >
                      {flavorsSelected.length} / {lengthObject.qtd_sabor}
                    </Box>
                  </Flex>
                </Flex>

                {flavorsSelected?.map((sab, index) => (
                  <Box
                    key={index}
                    w="100%"
                    borderTop="1px solid #EEF2F7"
                    padding={["18px", "24px"]}
                  >
                    <Flex
                      alignItems="center"
                      justifyContent="space-between"
                      flexWrap="wrap"
                    >
                      <Box>
                        <Text fontSize="md" fontWeight={700}>
                          {sab?.descricao}
                        </Text>
                      </Box>

                      <Box mt={["12px", "0"]}>
                        <Checkbox
                          isChecked
                          onChange={() => {
                            if (
                              dt.descricao &&
                              !dt.descricao.includes(sab.descricao)
                            ) {
                              const newFlavorsSelected = flavorsSelected.filter(
                                (entry) => entry.id_sabor != sab.id_sabor
                              );
                              setFlavorsSelected(newFlavorsSelected);
                            }
                          }}
                          size="lg"
                          sx={{
                            ".chakra-checkbox__control": {
                              w: "20px",
                              h: "20px",
                              borderRadius: "6px",
                              borderWidth: "2px",
                              borderColor: data?.primary_color || "#CF3F2E",
                              bg: data?.primary_color || "#CF3F2E",
                              transition: "all .15s ease",
                              boxShadow: "0 2px 6px rgba(207, 63, 46, .25)",
                            },
                          }}
                        />
                      </Box>
                    </Flex>

                    {sab?.observacao && (
                      <Text fontSize="sm" mt="8px" color="#6B7280">
                        Observação: {sab?.observacao}
                      </Text>
                    )}
                  </Box>
                ))}
              </Box>
            ) : (
              ""
            )}

            {productDetail.length > 0 && (
              <Box
                borderRadius="32px"
                border="1px solid #E5E7EB"
                bg="#FFFFFF"
                overflow="hidden"
              >
                <Flex
                  flexWrap={["wrap", "initial"]}
                  w="100%"
                  p={["20px", "28px"]}
                  alignItems="center"
                  justifyContent="space-between"
                  bg="#FDFDFD"
                >
                  <Text fontSize="14px" fontWeight={700} color="#111827" textTransform="uppercase" fontFamily="var(--font-poppins), system-ui, -apple-system, sans-serif">
                    Ingredientes extras e adicionais
                  </Text>
                </Flex>

                {productDetail.map((detail, index) => {
                  var detailTwo = detail[Object.keys(detail)[0]];

                  return detailTwo.map((item, itemIndex) => {
                    const groupKey = `detail-${index}-${itemIndex}`;
                    const isOpen = expandedGroups[groupKey] === true;
                    return (
                      <Box key={itemIndex} borderTop="1px solid #EEF2F7">
                        <Flex
                          w="100%"
                          p={["16px", "20px"]}
                          alignItems="center"
                          justifyContent="space-between"
                          bg="#FFFFFF"
                          borderBottom="1px solid #E5E7EB"
                          cursor="pointer"
                          onClick={() =>
                            setExpandedGroups((prev) => ({
                              ...prev,
                              [groupKey]: !isOpen,
                            }))
                          }
                        >
                          <Text fontSize="14px" fontWeight={700} textTransform="uppercase" fontFamily="var(--font-poppins), system-ui, -apple-system, sans-serif">
                            {item?.descricao}
                          </Text>
                          <Icon as={FiChevronDown} transform={isOpen ? "rotate(180deg)" : "rotate(0deg)"} transition="transform .2s ease" />
                        </Flex>

                        {isOpen && item.adicionais.map((add, addIndex) => (
                        <Flex
                          key={add.id}
                          w="100%"
                          px={0}
                          py={3}
                          alignItems="center"
                          justifyContent="space-between"
                          flexWrap="wrap"
                          borderTop={
                            addIndex === 0 ? "none" : "1px solid #E5E7EB"
                          }
                        >
                          <Box textAlign="left">
                            <Text fontSize="14px" fontWeight={600}>
                              {add.descricao}
                            </Text>
                          </Box>

                          <HStack spacing="12px" align="center">
                            <Text fontSize="14px" fontWeight={600}>
                              {moneyFormat.format(add.valor)}
                            </Text>

                            <Checkbox
                              isChecked={item.selected_index.includes(add)}
                              onChange={() => {
                                if (
                                  item.selected_index.length >=
                                    item.qtd_maximo &&
                                  !item.selected_index.includes(add) &&
                                  item.qtd_maximo > 0
                                ) {
                                  toast({
                                    title: "Aviso",
                                    description: `Selecione até ${item.qtd_maximo} opções`,
                                    status: "warning",
                                    duration: 2000,
                                    isClosable: true,
                                    position: "bottom-center",
                                  });
                                } else {
                                  handleSwitchChange(itemIndex, addIndex);
                                }
                              }}
                              size="lg"
                              sx={{
                                ".chakra-checkbox__control": {
                                  w: "20px",
                                  h: "20px",
                                  borderRadius: "4px",
                                  borderColor: "gray.300",
                                },
                                ".chakra-checkbox__control[data-checked]": {
                                  bg: data?.primary_color || "#CF3F2E",
                                  borderColor: data?.primary_color || "#CF3F2E",
                                },
                              }}
                            />
                          </HStack>
                        </Flex>
                        ))}
                      </Box>
                    );
                  });
                })}
              </Box>
            )}

            {gpAdicionais.length > 0 && (
              <Stack spacing={6}>
                {gpAdicionais.map((item, itemIndex) => {
                  const groupKey = `adc-${itemIndex}`;
                  const isOpen = expandedGroups[groupKey] === true;
                  return (
                  <Box
                    key={itemIndex}
                    bg="transparent"
                    border="none"
                    borderRadius="0"
                    overflow="visible"
                    mt={4}
                  >
                    <Flex
                      w="100%"
                      p={0}
                      alignItems="center"
                      justifyContent="space-between"
                      bg="transparent"
                      mb={2}
                      pb={2}
                      borderBottom="1px solid #E5E7EB"
                      cursor="pointer"
                      onClick={() =>
                        setExpandedGroups((prev) => ({
                          ...prev,
                          [groupKey]: !isOpen,
                        }))
                      }
                    >
                      <Text fontSize="14px" fontWeight={700} textTransform="uppercase" fontFamily="var(--font-poppins), system-ui, -apple-system, sans-serif">
                        {item.descricao}
                      </Text>
                      <Icon as={FiChevronDown} transform={isOpen ? "rotate(180deg)" : "rotate(0deg)"} transition="transform .2s ease" />
                    </Flex>

                    {isOpen && item.adicionais.map((add, addIndex) => (
                      <Flex
                        key={add.id}
                        w="100%"
                        px={0}
                        py={3}
                        alignItems="center"
                        justifyContent="space-between"
                        flexWrap="wrap"
                        borderTop={
                          addIndex === 0 ? "none" : "1px solid #E5E7EB"
                        }
                      >
                        <Box textAlign="left">
                          <Text fontSize="12px" fontWeight={400} fontFamily="var(--font-poppins), system-ui, -apple-system, sans-serif">
                            {add.descricao}
                          </Text>
                        </Box>

                        <HStack spacing="12px" align="center">
                          <Text fontSize="14px" fontWeight={600}>
                            {moneyFormat.format(add.valor)}
                          </Text>

                          <Checkbox
                            isChecked={item.selected_index.includes(add)}
                            onChange={() => {
                              if (
                                item.selected_index.length >= item.qtd_maximo &&
                                !item.selected_index.includes(add) &&
                                item.qtd_maximo > 0
                              ) {
                                toast({
                                  title: "Aviso",
                                  description: `Selecione até ${item.qtd_maximo} opções`,
                                  status: "warning",
                                  duration: 2000,
                                  isClosable: true,
                                  position: "bottom-center",
                                });
                              } else {
                                handleSwitchChange(itemIndex, addIndex);
                              }
                            }}
                            size="lg"
                            sx={{
                              ".chakra-checkbox__control": {
                                w: "20px",
                                h: "20px",
                                borderRadius: "4px",
                                borderColor: "gray.300",
                              },
                              ".chakra-checkbox__control[data-checked]": {
                                bg: data?.primary_color || "#CF3F2E",
                                borderColor: data?.primary_color || "#CF3F2E",
                              },
                            }}
                          />
                        </HStack>
                      </Flex>
                    ))}
                  </Box>
                  );
                })}
              </Stack>
            )}

            <Box bg="transparent" border="none" borderRadius="0" p={0} mt={4}>
              <FormControl>
                <FormLabel color="#111827" fontSize="md" fontWeight={700}>
                  Adicionar algum detalhe?
                </FormLabel>
                <Text mb="14px" fontSize="sm" color="#6B7280">
                  Converse diretamente com o estabelecimento caso queira
                  modificar algum item. Neste campo não são aceitas modificações
                  que podem gerar cobrança adicional.
                </Text>

                <Textarea
                  onChange={(e) => setObservacaoItem(e.target.value)}
                  value={observacaoItem}
                  placeholder="Escreva o detalhe aqui..."
                  size={["sm", "md"]}
                  border="1px solid #E0E0E0"
                  borderRadius="24px"
                  padding="24px"
                  resize="vertical"
                  minH="120px"
                  _focusVisible={{
                    borderColor: data?.primary_color,
                    boxShadow: `0 0 0 1px ${data?.primary_color}`,
                  }}
                  maxLength={140}
                  overflow="hidden"
                />
                <FormHelperText fontSize="sm" color="#6B7280" textAlign="right">
                  {observacaoItem.length}/140
                </FormHelperText>
              </FormControl>
            </Box>
          </Stack>
        </Box>

        {/* FOOTER / CTA – Barra de adicionar (mesma da /lista mas customizada) */}
        {opened && (
          <Box
            position="fixed"
            left="0"
            right="0"
            bottom="0"
            zIndex={998}
            bg="white"
            borderTopWidth="1px"
            borderTopColor="gray.200"
            boxShadow="0 -8px 24px rgba(0,0,0,0.06)"
            px="16px"
            py="14px"
          >
            <HStack maxW="640px" mx="auto" spacing={4}>
              <VStack align="start" spacing={0} flex="1">
                <Text fontSize="sm" color="gray.500">
                  Total dos pedidos
                </Text>
                <HStack spacing={2}>
                  <Text fontWeight="bold" fontSize="lg">
                    {moneyFormat.format(total)}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    / {count} {count === 1 ? "item" : "itens"}
                  </Text>
                </HStack>
              </VStack>

              <Button
                className="ver-sacola-btn"
                onClick={handleItemOrder}
                isDisabled={disable}
                color="white"
                bg="#CF3F2E"
                _hover={{ bg: "#B53626" }}
                _active={{ bg: "#B53626" }}
                _disabled={{ bg: "#E8A8A0", cursor: "not-allowed" }}
                size="lg"
                borderRadius="xl"
                px={6}
                fontSize="14px"
              >
                Adicionar
              </Button>
            </HStack>
          </Box>
        )}
      </Box>

      {/* Cart Modal */}
      <CartModal
        isOpen={isCartOpen}
        onClose={onCartClose}
        items={cartItems.map((item, index) => ({
          // usar índice da linha para operações independentes por item
          id: index,
          name: item.descricao || item.tag || "Produto",
          price: item.valor_total / item.quantidade,
          imageUrl: item.foto_destaque || "/placeholder.png",
          qty: item.quantidade,
        }))}
        subtotal={cartTotal}
        discounts={0}
        onInc={(lineIndex) => {
          const updatedBag = cartItems.map((item, idx) => {
            if (idx === lineIndex) {
              const newQty = item.quantidade + 1;
              const unitPrice = item.valor_total / item.quantidade;
              return {
                ...item,
                quantidade: newQty,
                valor_total: unitPrice * newQty,
              };
            }
            return item;
          });
          setCartItems(updatedBag);
          setCartTotal(
            updatedBag.reduce((sum, item) => sum + item.valor_total, 0)
          );
          localStorage.setItem(
            "@menu-digital:" + subdomain + ":bag",
            JSON.stringify(updatedBag)
          );
        }}
        onDec={(lineIndex) => {
          const updatedBag = cartItems
            .map((item, idx) => {
              if (idx === lineIndex && item.quantidade > 1) {
                const newQty = item.quantidade - 1;
                const unitPrice = item.valor_total / item.quantidade;
                return {
                  ...item,
                  quantidade: newQty,
                  valor_total: unitPrice * newQty,
                };
              }
              return item;
            })
            .filter((item) => item.quantidade > 0);
          setCartItems(updatedBag);
          setCartTotal(
            updatedBag.reduce((sum, item) => sum + item.valor_total, 0)
          );
          localStorage.setItem(
            "@menu-digital:" + subdomain + ":bag",
            JSON.stringify(updatedBag)
          );
        }}
        onRemove={(lineIndex) => {
          const updatedBag = cartItems.slice();
          if (lineIndex < 0 || lineIndex >= updatedBag.length) return;
          updatedBag.splice(lineIndex, 1);
          setCartItems(updatedBag);
          setCartTotal(
            updatedBag.reduce((sum, item) => sum + item.valor_total, 0)
          );
          localStorage.setItem(
            "@menu-digital:" + subdomain + ":bag",
            JSON.stringify(updatedBag)
          );
        }}
        subdomain={subdomain}
      />
    </Box>
  );
}

function mapState(state) {
  const { sabores } = state;
  return { sabores };
}

const actionCreators = {
  getAll: saboresActions.getAll,
};

export default connect(mapState, actionCreators)(InfoProduct);
