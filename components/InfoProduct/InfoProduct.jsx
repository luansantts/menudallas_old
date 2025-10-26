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
  Icon,
  Input,
  Radio,
  Stack,
  Switch,
  Tag,
  Text,
  Textarea,
  Divider,
  UnorderedList,
  ListItem,
  useToast,
} from "@chakra-ui/react";
import { isEmpty } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { getOpened } from "../../utils/getOpened";
import { moneyFormat } from "../../utils/moneyFormat";
import { connect } from "react-redux";
import { saboresActions } from "../../store/actions";
import { Loading } from "../Loading";
import { FiCheck, FiSearch } from "react-icons/fi";
import { BsPlusLg } from "react-icons/bs";
import { GrSubtract } from "react-icons/gr";
import { MdClose } from "react-icons/md";
import { FooterProduct } from "../FooterProduct";
import { addCart } from "../../utils/addCart";
import { useRouter } from "next/router";
import Swal from 'sweetalert2';
import Image from "next/image";

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
  const router = useRouter();

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
      confirmButtonColor: data?.primary_color || "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, adicionar",
      cancelButtonText: "Cancelar",
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
        router.push("/lista");
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
    <>
      <Box bg="#F5F5F5" minH="100vh" pb={["220px", "200px"]}>
        <Box
          bgGradient="linear(to-b, #FFFFFF 15%, #F5F5F5 100%)"
          pt={["140px", "160px"]}
          pb={["60px", "100px"]}
        >
          <Container maxW="4xl" px={["20px", "32px"]}>
            <Box display="flex" justifyContent="center">
              <Box
                bg="white"
                borderRadius="40px"
                w="100%"
                maxW="560px"
                p={["24px", "32px"]}
                boxShadow="0px 35px 90px rgba(15, 23, 42, 0.15)"
              >
                <Image
                  className="imgViewProduct"
                  src={dt?.foto_destaque}
                  width={560}
                  height={420}
                  style={{
                    width: "100%",
                    height: "auto",
                    objectFit: "contain",
                  }}
                  alt={dt?.descricao}
                  loader={({ src }) => src}
                />
              </Box>
            </Box>
          </Container>
        </Box>

        <Container maxW="4xl" px={["20px", "32px"]} mt={["-100px", "-150px"]}>
          <Box
            bg="white"
            borderRadius="40px"
            boxShadow="0px 45px 90px rgba(15, 23, 42, 0.18)"
            p={["30px", "48px"]}
          >
            <Stack spacing={10}>
              <Box>
                <Flex alignItems="center" gap="3">
                  <Box
                    w="56px"
                    h="56px"
                    borderRadius="full"
                    overflow="hidden"
                    bg="#FFF4E0"
                    border="1px solid #FFE7BF"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    {data?.logo_home ? (
                      <Image
                        src={data?.logo_home}
                        alt={data?.nome}
                        width={56}
                        height={56}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        loader={({ src }) => src}
                      />
                    ) : (
                      <Text fontWeight={700} color={data?.primary_color || "#F59E0B"}>
                        {data?.nome?.[0]?.toUpperCase() || "S"}
                      </Text>
                    )}
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="#9CA3AF">
                      {data?.nome || "Estabelecimento"}
                    </Text>
                    <Text fontSize="lg" fontWeight={700} color="#111827">
                      {dt?.descricao}
                    </Text>
                  </Box>
                </Flex>

                {dt.tag && (
                  <Tag
                    mt="4"
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

                {dt?.detalhe && (
                  <Text mt="6" color="#4B5563" lineHeight="1.7">
                    {dt?.detalhe}
                  </Text>
                )}

                <Flex
                  mt="6"
                  alignItems={["flex-start", "center"]}
                  justifyContent="space-between"
                  flexDirection={["column", "row"]}
                  gap="24px"
                >
                  <Box>
                    <Text
                      fontSize="xs"
                      textTransform="uppercase"
                      letterSpacing="0.25em"
                      color="#9CA3AF"
                      fontWeight={700}
                    >
                      Preço
                    </Text>
                    <Text fontSize={["36px", "48px"]} fontWeight={700} color="#111827">
                      {moneyFormat.format(totalUnity || 0)}
                    </Text>
                    {isRangeProduct && (
                      <Text fontSize="sm" color="#6B7280">
                        De {moneyFormat.format(dt?.valor_de || 0)} até {moneyFormat.format(dt?.valor_ate || 0)}
                      </Text>
                    )}
                    {hasPromotion && (
                      <Text fontSize="sm" color="#9CA3AF" textDecoration="line-through">
                        {moneyFormat.format(dt?.valor || 0)}
                      </Text>
                    )}
                    {count > 1 && (
                      <Text fontSize="sm" color="#6B7280">
                        Total: {moneyFormat.format(total || 0)}
                      </Text>
                    )}
                  </Box>

                  <Flex
                    alignItems="center"
                    borderRadius="full"
                    border="1px solid #E5E7EB"
                    bg="#F9FAFB"
                    padding="10px 20px"
                    gap="18px"
                  >
                    <Button
                      onClick={handleDecreaseCount}
                      variant="ghost"
                      w="42px"
                      h="42px"
                      borderRadius="full"
                      bg="white"
                      boxShadow="0px 15px 25px rgba(15, 23, 42, 0.12)"
                    >
                      <Icon as={GrSubtract} />
                    </Button>
                    <Text fontSize="20px" fontWeight={700} color="#111827">
                      {count}
                    </Text>
                    <Button
                      onClick={handleIncreaseCount}
                      variant="ghost"
                      w="42px"
                      h="42px"
                      borderRadius="full"
                      bg={data?.primary_color || "#F59E0B"}
                      color="white"
                      boxShadow="0px 15px 25px rgba(245, 158, 11, 0.4)"
                      _hover={{ opacity: 0.85 }}
                    >
                      <Icon as={BsPlusLg} />
                    </Button>
                  </Flex>
                </Flex>
              </Box>

              <Divider />

              <Box>
                <Text fontSize="lg" fontWeight={700} color="#111827">
                  Sobre
                </Text>
                <Text mt="3" color="#4B5563" lineHeight="1.7">
                  {dt?.detalhe ||
                    "Esse produto está pronto para deixar o seu pedido ainda mais especial."}
                </Text>

                {ingredientsList.length > 0 && (
                  <Box mt="8">
                    <Text fontSize="lg" fontWeight={700} color="#111827">
                      Ingredientes
                    </Text>
                    <UnorderedList mt="3" spacing="2" color="#4B5563" pl="20px">
                      {ingredientsList.map((item, index) => (
                        <ListItem key={`${item}-${index}`}>{item}</ListItem>
                      ))}
                    </UnorderedList>
                  </Box>
                )}
              </Box>

              {gpTamanhos.length > 0 && (
                <Box
                  borderRadius="32px"
                  border="1px solid #E5E7EB"
                  bg="#FDFDFD"
                  overflow="hidden"
                >
                  <Flex
                    flexWrap={["wrap", "nowrap"]}
                    w="100%"
                    p={["20px", "28px"]}
                    alignItems="center"
                    justifyContent="space-between"
                    bg="#FFFFFF"
                    borderBottom="1px solid #EEF2F7"
                  >
                    <Box textAlign={["center", "initial"]} w={["100%", "60%"]}>
                      <Text fontSize="lg" fontWeight={700}>
                        Escolha o tamanho
                      </Text>
                      <Text fontSize="sm" color="#6B7280">
                        Escolha no mínimo 1 opção
                      </Text>
                    </Box>

                    <Flex
                      w={["100%", "auto"]}
                      justifyContent={["center", "flex-end"]}
                      mt={["16px", "0"]}
                      gap="12px"
                    >
                      <Box
                        bg={data?.primary_color || "#F59E0B"}
                        borderRadius="full"
                        padding="10px 22px"
                        fontSize="14px"
                        fontWeight={700}
                        color="#fff"
                      >
                        {!isEmpty(lengthObject) ? 1 : 0} / 1
                      </Box>

                      <Box
                        bg="#FFE8E8"
                        borderRadius="full"
                        padding="10px 22px"
                        fontSize="12px"
                        fontWeight={700}
                        color="#FF1D1D"
                      >
                        Obrigatório
                      </Box>
                    </Flex>
                  </Flex>

                  {gpTamanhos.map((tam, index) => (
                    <Flex
                      key={index}
                      w="100%"
                      borderBottom={
                        index + 1 === gpTamanhos.length ? "none" : "1px solid #EEF2F7"
                      }
                      padding={["20px", "28px"]}
                      alignItems="center"
                      justifyContent="space-between"
                      flexWrap="wrap"
                    >
                      <Box>
                        <Text fontSize="md" fontWeight={700}>
                          {tam?.tamanho}
                        </Text>
                        <Text fontSize="sm" color="#6B7280">
                          Até {tam?.qtd_sabor} sabores
                        </Text>
                      </Box>

                      <Box mt={["12px", "0"]}>
                        <Switch
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
                          size={["md", "lg"]}
                          css={{
                            ".chakra-switch__track[data-checked]": {
                              "--switch-bg": data?.primary_color,
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
                    <DrawerContent borderRadius="32px 32px 0 0">
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
                      <DrawerBody>
                        {!searchFlavors && (
                          <>
                            <Flex flexWrap={["wrap", "initial"]} w="100%" p="25px">
                              <Box textAlign={["center", "initial"]} w={["100%", "60%"]}>
                                <Text fontSize="16px" fontWeight={600} textTransform="uppercase">
                                  Sabores disponíveis para esse tamanho
                                </Text>
                                <Text fontSize="14px" fontWeight={400}>
                                  Escolha no mínimo 1 opção
                                </Text>
                              </Box>

                              <Flex
                                w={["40%", "40%"]}
                                justifyContent={["center", "initial"]}
                                w={["100%", "initial"]}
                                mt={["15px", ""]}
                              >
                                <Box
                                  bg={data?.primary_color}
                                  borderRadius="5px"
                                  padding="10px 18px"
                                  fontSize={["14px", "16px"]}
                                  fontWeight={600}
                                  color="#fff"
                                >
                                  {flavorsSelected.length} / {lengthObject.qtd_sabor}
                                </Box>

                                <Box
                                  ml="16px"
                                  bg="#FFE8E8"
                                  borderRadius="5px"
                                  padding="12px 20px"
                                  fontSize={["12px", "14px"]}
                                  fontWeight={600}
                                  color="#FF1D1D"
                                >
                                  Obrigatório
                                </Box>
                              </Flex>
                            </Flex>

                            <Box p="0px 25px" overflowY="auto" maxH="650px">
                              <Box
                                border="1px solid #CECECE"
                                borderRadius="22px 22px 0px 0px"
                              >
                                <Box
                                  bg="#DDD"
                                  w="100%"
                                  p="25px"
                                  alignItems="center"
                                  justifyContent="space-between"
                                  borderRadius="22px 22px 0px 0px"
                                >
                                  <Box textAlign={["center", "initial"]} w={["100%", "60%"]}>
                                    <Text fontSize="16px" fontWeight={600} textTransform="uppercase">
                                      Faça sua escolha de sabores
                                    </Text>
                                    <Text fontSize="14px" fontWeight={400}>
                                      Escolha até {lengthObject.qtd_sabor} opç
                                      {lengthObject.qtd_sabor > 1 ? "ões" : "ão"}
                                    </Text>
                                  </Box>

                                  <Flex
                                    w={["40%", "40%"]}
                                    justifyContent={["center", "initial"]}
                                    w={["100%", "initial"]}
                                    mt={["15px", ""]}
                                  >
                                    <Box
                                      bg={data?.primary_color}
                                      borderRadius="5px"
                                      padding="10px 18px"
                                      fontSize={["14px", "16px"]}
                                      fontWeight={600}
                                      color="#fff"
                                    >
                                      {flavorsSelected.length} / {lengthObject.qtd_sabor}
                                    </Box>
                                  </Flex>
                                </Box>

                                <Box className="saboresList">
                                  {flavorsFilters.map((sab, index) => (
                                    <Box
                                      borderBottom={
                                        flavorsFilters.length === index + 1
                                          ? ""
                                          : "1px solid #CECECE"
                                      }
                                    >
                                      <Flex
                                        justifyContent="space-between"
                                        alignItems="center"
                                        key={index}
                                        p="10px"
                                        pl={0}
                                        pr={0}
                                      >
                                        <Text fontSize="13px" fontWeight={600}>
                                          {sab?.descricao}
                                        </Text>
                                        <Flex alignItems="center" gap="20px">
                                          <Text as="strong" fontSize="14px">
                                            {moneyFormat.format(sab?.valor)}
                                          </Text>
                                          <Checkbox
                                            size="lg"
                                            color={
                                              data.primary_color != undefined
                                                ? data.primary_color
                                                : "#1e90ff"
                                            }
                                            isChecked={
                                              flavorsSelected.filter(
                                                (filter) =>
                                                  filter.id_sabor == sab.id_sabor
                                              ).length > 0
                                                ? true
                                                : false
                                            }
                                            onChange={(e) => {
                                              let dt = flavorsSelected;
                                              if (lengthObject.qtd_sabor === 0) {
                                                if (
                                                  flavorsSelected.find(
                                                    (filter) => filter === sab
                                                  ) !== undefined
                                                ) {
                                                  if (
                                                    sab.descricao !== dt.descricao
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
                                          ></Checkbox>
                                        </Flex>
                                      </Flex>

                                      {flavorsSelected.filter(
                                        (filter) =>
                                          filter.id_sabor == sab.id_sabor
                                      ).length > 0 && (
                                        <Textarea
                                          mb={5}
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
                                            setFlavorsSelected((prevFlavors) => {
                                              return prevFlavors.map((flavor) => {
                                                if (flavor.id_sabor === sab.id_sabor) {
                                                  return {
                                                    ...flavor,
                                                    observacao: e.target.value,
                                                  };
                                                }
                                                return flavor;
                                              });
                                            });
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
                                  ))}
                                </Box>
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
                      <Flex alignItems="center" justifyContent="space-between" flexWrap="wrap">
                        <Box>
                          <Text fontSize="md" fontWeight={700}>
                            {sab?.descricao}
                          </Text>
                        </Box>

                        <Box mt={["12px", "0"]}>
                          <Switch
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
                            size={["md", "lg"]}
                            css={{
                              ".chakra-switch__track[data-checked]": {
                                "--switch-bg": data?.primary_color,
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
                    <Box textAlign={["center", "initial"]} w={["100%", "60%"]}>
                      <Text fontSize="lg" fontWeight={700}>
                        Ingredientes extras e adicionais
                      </Text>
                      <Text fontSize="sm" color="#6B7280">
                        Escolha no mínimo {" "}
                        {productDetail.length > 0 &&
                          Object.values(productDetail[0])[0][0]?.qtd_minimo}
                        {" "} opções
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
                        {productDetail.length > 0
                          ? Object.values(productDetail[0])[0][0]?.selected_index.length
                          : 0}
                        /
                        {productDetail.length > 0 &&
                          Object.values(productDetail[0])[0][0]?.qtd_maximo}
                      </Box>
                    </Flex>
                  </Flex>

                  {productDetail.map((detail, index) => {
                    var detailTwo = detail[Object.keys(detail)[0]];

                    return detailTwo.map((item, itemIndex) => (
                      <Box key={itemIndex} borderTop="1px solid #EEF2F7">
                        <Flex
                          flexWrap={["wrap", "initial"]}
                          w="100%"
                          p={["20px", "28px"]}
                          alignItems="center"
                          justifyContent="space-between"
                          bg="#FFFFFF"
                        >
                          <Box textAlign={["center", "initial"]} w={["100%", "60%"]}>
                            <Text fontSize="md" fontWeight={700}>
                              {item?.descricao}
                            </Text>
                            <Text fontSize="sm" color="#6B7280">
                              Escolha no mínimo {item?.qtd_minimo} opç
                              {item.qtd_minimo > 1 ? "ões" : "ão"}
                            </Text>
                          </Box>

                          <Flex
                            w={["100%", "auto"]}
                            justifyContent={["center", "flex-end"]}
                            mt={["16px", "0"]}
                            gap="12px"
                          >
                            <Box
                              bg={data?.primary_color || "#F59E0B"}
                              borderRadius="full"
                              padding="10px 22px"
                              fontSize="14px"
                              fontWeight={700}
                              color="#fff"
                            >
                              {item.selected_index.length} / {item.qtd_maximo}
                            </Box>

                            {item.obrigatorio === "N" ? (
                              <Box
                                bg="#E7F8E7"
                                borderRadius="full"
                                padding="10px 22px"
                                fontSize="12px"
                                fontWeight={700}
                                color="#50A773"
                              >
                                Opcional
                              </Box>
                            ) : (
                              <Box
                                bg="#FFE8E8"
                                borderRadius="full"
                                padding="10px 22px"
                                fontSize="12px"
                                fontWeight={700}
                                color="#FF1D1D"
                              >
                                Obrigatório
                              </Box>
                            )}
                          </Flex>
                        </Flex>

                        {item.adicionais.map((add, addIndex) => (
                          <Flex
                            key={add.id}
                            w="100%"
                            borderTop="1px solid #F3F4F6"
                            padding={["18px", "24px"]}
                            alignItems="center"
                            justifyContent="space-between"
                            flexWrap="wrap"
                          >
                            <Box>
                              <Text fontSize="md" fontWeight={600}>
                                {add.descricao}
                              </Text>
                              <Text fontSize="sm" color="#6B7280">
                                {moneyFormat.format(add.valor)}
                              </Text>
                            </Box>
                            <Box mt={["12px", "0"]}>
                              <Switch
                                isChecked={item.selected_index.includes(add)}
                                onChange={(e) => {
                                  if (
                                    item.selected_index.length >= item.qtd_maximo &&
                                    e.target.checked &&
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
                                size={["md", "lg"]}
                                css={{
                                  ".chakra-switch__track[data-checked]": {
                                    "--switch-bg": data?.primary_color,
                                  },
                                }}
                              />
                            </Box>
                          </Flex>
                        ))}
                      </Box>
                    ));
                  })}
                </Box>
              )}

              {gpAdicionais.length > 0 && (
                <Stack spacing={6}>
                  {gpAdicionais.map((item, itemIndex) => (
                    <Box
                      key={itemIndex}
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
                          <Text fontSize="md" fontWeight={700}>
                            {item.descricao}
                          </Text>
                        </Box>

                        <Flex
                          w={["100%", "auto"]}
                          justifyContent={["center", "flex-end"]}
                          mt={["16px", "0"]}
                          gap="12px"
                        >
                          <Box
                            bg={data?.primary_color || "#F59E0B"}
                            borderRadius="full"
                            padding="10px 22px"
                            fontSize="14px"
                            fontWeight={700}
                            color="#fff"
                          >
                            {item.selected_index.length} / {item.qtd_maximo}
                          </Box>

                          {item.obrigatorio === "N" ? (
                            <Box
                              bg="#E7F8E7"
                              borderRadius="full"
                              padding="10px 22px"
                              fontSize="12px"
                              fontWeight={700}
                              color="#50A773"
                            >
                              Opcional
                            </Box>
                          ) : (
                            <Box
                              bg="#FFE8E8"
                              borderRadius="full"
                              padding="10px 22px"
                              fontSize="12px"
                              fontWeight={700}
                              color="#FF1D1D"
                            >
                              Obrigatório
                            </Box>
                          )}
                        </Flex>
                      </Flex>

                      {item.adicionais.map((add, addIndex) => (
                        <Flex
                          key={add.id}
                          w="100%"
                          borderTop="1px solid #F3F4F6"
                          padding={["18px", "24px"]}
                          alignItems="center"
                          justifyContent="space-between"
                          flexWrap="wrap"
                        >
                          <Box>
                            <Text fontSize="md" fontWeight={600}>
                              {add.descricao}
                            </Text>
                            <Text fontSize="sm" color="#6B7280">
                              {moneyFormat.format(add.valor)}
                            </Text>
                          </Box>
                          <Box mt={["12px", "0"]}>
                            <Switch
                              isChecked={item.selected_index.includes(add)}
                              onChange={(e) => {
                                if (
                                  item.selected_index.length >= item.qtd_maximo &&
                                  e.target.checked &&
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
                              size={["md", "lg"]}
                              css={{
                                ".chakra-switch__track[data-checked]": {
                                  "--switch-bg": data?.primary_color,
                                },
                              }}
                            />
                          </Box>
                        </Flex>
                      ))}
                    </Box>
                  ))}
                </Stack>
              )}

              <Box borderRadius="32px" border="1px solid #E5E7EB" bg="#FFFFFF" p={["20px", "28px"]}>
                <FormControl>
                  <FormLabel color="#111827" fontSize="md" fontWeight={700}>
                    Adicionar algum detalhe?
                  </FormLabel>
                  <Text mb="14px" fontSize="sm" color="#6B7280">
                    Converse diretamente com o estabelecimento caso queira modificar
                    algum item. Neste campo não são aceitas modificações que podem
                    gerar cobrança adicional.
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
        </Container>
      </Box>

      <FooterProduct
        data={data}
        disable={disable}
        handleItemOrder={handleItemOrder}
        opened={opened}
        total={total}
      />
    </>
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
