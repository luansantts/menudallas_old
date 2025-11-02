import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  ListItem,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Text,
  Textarea,
  UnorderedList,
  useToast,
} from "@chakra-ui/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { BsChatRightDots, BsCreditCard2Back, BsPlusLg } from "react-icons/bs";
import { FaWalking } from "react-icons/fa";
import { GrChat, GrSubtract } from "react-icons/gr";
import {
  MdClose,
  MdOutlineAttachMoney,
  MdOutlineCardGiftcard,
  MdOutlineChatBubble,
} from "react-icons/md";
import { NavbarOrder } from "../NavbarOrder";
import { useRouter } from "next/router";
import slugify from "slugify";
import InputMask from "react-input-mask";
import axios from "axios";
import { isLogged, userDataLogged } from "../../utils/auth";
import { connect } from "react-redux";
import {
  bairrosActions,
  couponsActions,
  pedidoActions,
  pedidoUserActions,
} from "../../store/actions";
import { isEmpty } from "lodash";
import DrawerFormaPg from "./DrawerFormaPg";
import { moneyFormat } from "../../utils/moneyFormat";
import { Loading } from "../Loading";
import { v4 } from "uuid";
import Swal from "sweetalert2";

function OrderContext({
  data,
  subdomain,
  bairros,
  getAllBairros,
  createPedido,
  createPedidoUser,
  couponsValidar,
  validarCupom,
}) {
  const [total, setTotal] = useState(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [delivery, setDelivery] = useState("1");
  const [loadingOrder, setLoadingOrder] = useState(0);
  const [openTipoEntrega, setOpenTipoEntrega] = useState(false);
  const [bag, setBag] = useState([]);
  const [cep, setCep] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState(data.cidade);
  const [estado, setEstado] = useState(data.estado);
  const [bairrosArray, setBairrosArray] = useState([]);
  const [msgErrorEndereco, setMsgErrorEndereco] = useState("");
  const [openFormaPg, setOpenFormaPg] = useState(false);
  const [order, setOrder] = useState({});
  const [valorTotal, setValorTotal] = useState(0);
  const [coupon, setCoupon] = useState("");
  const [cupomValidarLoading, setCupomValidarLoading] = useState(false);
  const [cupomValidarFeedback, setCupomValidarFeedback] = useState("");
  const [cupomDesconto, setCupomDesconto] = useState(0);

  const toast = useToast();
  const router = useRouter();

  // Inicializa o modo de entrega conforme preferência salva na home
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("orderMode");
        if (saved === "entrega") {
          setDelivery("1");
        } else if (saved === "retirada") {
          setDelivery("2");
        }
      }
    } catch (_) {}
  }, []);

  useEffect(() => {
    setCupomDesconto(0);
    if (couponsValidar.loading) {
      setCupomValidarLoading(true);
    } else {
      setCupomValidarLoading(false);
    }

    if (couponsValidar?.items && couponsValidar?.items.length > 0) {
      setCupomValidarFeedback("Cupom de desconto aplicado");
      setCupomDesconto(couponsValidar.items[0].valorDesconto);
    } else if (couponsValidar?.error) {
      setCupomValidarFeedback("Cupom de desconto inválido");
    }
  }, [couponsValidar]);

  useEffect(() => {
    setValorTotal(
      total +
        (order.valor_taxa != undefined && delivery == 1
          ? order.valor_taxa
          : 0) -
        cupomDesconto
    );
  }, [total, order, delivery, cupomDesconto, bag]);

  useEffect(() => {
    const b = localStorage.getItem("@menu-digital:" + subdomain + ":bag");

    if (b !== null) {
      setBag(JSON.parse(b));

      if (JSON.parse(b).length > 0) {
        let cont = 0;
        JSON.parse(b).forEach((element) => {
          // valor_total já é o total (preço unitário * quantidade)
          // Não multiplicar por quantidade novamente!
          cont = cont + element.valor_total;
        });
        setTotal(cont);
      }
    } else {
      router.push("/lista");
    }
  }, [subdomain]);

  useEffect(() => {
    if (isEmpty(bairrosArray)) {
      getAllBairros(data.user_id);
    }
  }, [data.user_id]);

  useEffect(() => {
    if (bairros?.items && bairros?.items.length > 0) {
      setBairrosArray(bairros?.items);
    }
  }, [bairros]);

  useEffect(() => {
    if (isLogged) {
      setCep(userDataLogged?.cep);
      setLogradouro(userDataLogged?.endereco);
      setNumero(userDataLogged?.numero);
      setComplemento(userDataLogged?.complemento);
      setBairro(userDataLogged?.bairro);
      // setEstado(userDataLogged?.estado);
      // setCidade(userDataLogged?.cidade);
      setName(userDataLogged?.nome);
      setPhone(userDataLogged?.celular);
    }
  }, [isLogged]);

  useEffect(() => {
    if (bairro == "" || !bairro) {
      return setMsgErrorEndereco("");
    }
    if (
      bairrosArray.filter(
        (entry) => entry.bairro.toLowerCase() == bairro.toLowerCase()
      ).length == 0
    ) {
      return setMsgErrorEndereco(
        "Não atendemos o bairro (" + bairro + ") digitado!"
      );
    } else if (data?.cidade !== cidade) {
      return setMsgErrorEndereco(
        "Não atendemos na cidade (" + cidade + ") digitada!"
      );
    } else if (data?.estado !== estado) {
      return setMsgErrorEndereco(
        "Não atendemos no estado (" + estado + ") digitado!"
      );
    } else {
      let bairroSelected = bairrosArray.find(
        (entry) => entry.bairro.toLowerCase() == bairro.toLowerCase()
      );
      setOrder({
        ...order,
        valor_taxa: bairroSelected?.valor,
      });

      setMsgErrorEndereco("");
    }
  }, [bairro, cidade, estado, bairrosArray]);

  const handleOrder = () => {
    if (bag.length === 0) {
      toast({
        title: "Alerta",
        description: `Não é possível finalizar o pedido sem itens no carrinho`,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top-center",
      });
      return router.push("/lista");
    }

    if (phone.length < 15) {
      return toast({
        title: "Alerta",
        description: `Telefone inválido`,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top-center",
      });
    }

    if (
      bag.length > 0 &&
      delivery !== undefined &&
      (delivery == 1 ? msgErrorEndereco === "" : true) &&
      name.length > 0 &&
      phone.length > 0 &&
      order.id_forma !== undefined
    ) {
      // Substituir window.confirm por SweetAlert2
      Swal.fire({
        title: "Finalizar pedido",
        text: "Deseja finalizar o pedido?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: data?.primary_color || "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, finalizar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          handleOrderFinally();
        }
      });
    } else {
      toast({
        title: "Alerta",
        description: `Preencha todos os campos obrigatórios`,
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "top-center",
      });
    }
  };

  const handleOrderFinally = async () => {
    setLoadingOrder(1);

    try {
      let dataOrder = {
        nome: name,
        celular: phone,
        observacao: note,
      };

      if (delivery == 1) {
        dataOrder.operacao = "ENTREGA";
      }
      if (delivery == 2) {
        dataOrder.operacao = "RETIRAR";
      }

      var bagNew = bag;

      for (let i = 0; i < bagNew.length; i++) {
        const item = bag[i];

        if (item.tipo === "P" || item.tipo == "O") {
          item.descricao = item.descricao
            .replaceAll(item.quantidade + "/" + item.sabores.length, "")
            .trim();
          item.descricao =
            item.quantidade + "/" + item.sabores.length + " " + item.descricao;
          item.valor =
            data?.regra_valor_montagem == "MEDIA"
              ? item.total / item.sabores.length
              : Math.max.apply(
                  Math,
                  item.sabores?.map(function (o) {
                    return o.valor;
                  })
                );

          for (let x = 0; x < item.sabores.length; x++) {
            const sabor = item.sabores[x];

            sabor.descricao = sabor.descricao
              .replaceAll(item.quantidade + "/" + item.sabores.length, "")
              .trim();
            sabor.descricao =
              item.quantidade +
              "/" +
              item.sabores.length +
              " " +
              sabor.descricao;
          }
        }
      }

      let dt = {
        ...order,
        ...dataOrder,
        user_id: data.user_id,
        totalProdutos: total,
        cep: cep,
        logradouro: logradouro,
        numero: numero,
        bairro: bairro,
        cidade: cidade,
        uf: estado,
        complemento: complemento,
        itens: bagNew,
        empresa: subdomain,
        IdCliente: userDataLogged?.id,
      };

      delete dt.id;

      dt.valor_total =
        total + parseFloat(dt.valor_taxa ? dt.valor_taxa : 0) - cupomDesconto;

      var celularWhats = data.numero_whats.replaceAll(" ", "");
      celularWhats = celularWhats.replaceAll("(", "");
      celularWhats = celularWhats.replaceAll(")", "");
      celularWhats = celularWhats.replaceAll("-", "");

      var textoWhats =
        "🔔 *Novo pedido via https://" +
        subdomain +
        ".menudallas.com.br" +
        "*\n\n";

      textoWhats +=
        "*Cliente:* " + dt.nome.toUpperCase() + " " + dt.celular + "\n\n";

      var enderecoMsg = `${dt.logradouro}, ${dt.numero} - ${dt.bairro} ${
        dt.complemento != "" ? " - Complemento: " + dt.complemento : ""
      } - (${dt.cidade}/${dt.uf})`;

      if (dt.operacao.toUpperCase() != "RETIRAR") {
        textoWhats += "*Endereço:* " + enderecoMsg + "\n\n";
      }

      textoWhats += "*Itens:*";

      var vlAdicionais = 0;
      var vlTotal = 0;

      for (let i = 0; i < dt.itens.length; i++) {
        const item = dt.itens[i];

        var descProduto =
          item.tipo == "P"
            ? item.tag + " - " + item.tamanho.tag
            : item.descricao;
        textoWhats +=
          "\n" + item.quantidade + " x " + descProduto.toUpperCase() + "\n";

        if (item.tipo == "P") {
          vlTotal +=
            (data?.regra_valor_montagem == "MEDIA"
              ? item.total / item.sabores.length
              : Math.max.apply(
                  Math,
                  item.sabores?.map(function (o) {
                    return o.valor;
                  })
                )) * item.quantidade;
        } else {
          vlTotal += item.valor * item.quantidade;
        }

        if (item.sabores) {
          for (let x = 0; x < item.sabores.length; x++) {
            const element = item.sabores[x];

            textoWhats +=
              "  1/" +
              item.sabores.length +
              " " +
              element.descricao.replaceAll(
                item.quantidade + "/" + item.sabores.length + " ",
                ""
              ) +
              "\n";
          }
        }

        if (item.adicional) {
          for (let x = 0; x < item.adicional.length; x++) {
            const element = item.adicional[x];

            if (item.adicional.length == x + 1) {
              textoWhats += "  ADIC. " + element.descricao + "\n";
            } else {
              textoWhats += "  ADIC. " + element.descricao + "\n";
            }

            vlAdicionais += element.valor * element.quantidade;
            vlTotal += vlAdicionais;
          }
        }
      }

      textoWhats +=
        "\n*Valor dos itens:* " + moneyFormat.format(dt.total_produtos) + "\n";

      if (dt.operacao.toUpperCase() != "RETIRAR") {
        textoWhats +=
          "*Valor da entrega:* " + moneyFormat.format(dt.valor_taxa) + "\n";
      }

      vlTotal = vlTotal + parseFloat(dt.valor_taxa);

      textoWhats +=
        "*Valor dos adicionais:*  " + moneyFormat.format(vlAdicionais) + "\n";
      textoWhats += "*Valor total:* " + moneyFormat.format(vlTotal) + "\n\n";

      textoWhats += "*Tipo de pagamento:* " + dt.operacao + "\n";
      textoWhats += "*Forma de Pagamento:* " + dt.forma + "\n";
      textoWhats +=
        "*Troco:* " +
        moneyFormat.format(dt.valor_para_troco ? dt.valor_para_troco : 0) +
        "\n";

      // createPedidoUser(dt);
      createPedido(dt, celularWhats, textoWhats);
      Swal.fire({
        title: "Sucesso!",
        text: "Pedido realizado com sucesso",
        icon: "success",
        confirmButtonColor: data?.primary_color || "#3085d6",
        confirmButtonText: "OK",
      }).then(() => {
        // Esta função será executada quando o usuário clicar em OK ou fechar o alerta
        setLoadingOrder(0);
        localStorage.removeItem("@menu-digital:" + subdomain + ":bag");
        router.push("/lista");
      });
    } catch (error) {
      toast({
        title: "Alerta",
        description: `Ocorreu um erro interno`,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top-center",
      });
      setLoadingOrder(0);
      router.push("/lista");
    }
  };

  function updateToCard(key, qtd) {
    if (qtd === 0) {
      // Substituir window.confirm por SweetAlert2
      Swal.fire({
        title: "Remover item",
        text: "Deseja remover item do pedido?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: data?.primary_color || "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, remover",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          const newBag = bag.filter((_, index) => index !== key);

          setCoupon("");
          setCupomDesconto(0);
          setCupomValidarLoading(false);
          setCupomValidarFeedback("");

          setBag(newBag);

          if (isEmpty(newBag)) {
            localStorage.removeItem("@menu-digital:" + subdomain + ":bag");
            router.push("/lista");
          } else {
            localStorage.setItem(
              "@menu-digital:" + subdomain + ":bag",
              JSON.stringify(newBag)
            );
          }
        }
      });

      return;
    } else {
      const newBag = bag.map((entry, index) => {
        if (index == key) {
          return { ...entry, quantidade: qtd };
        }
        return entry;
      });

      setBag(newBag);

      localStorage.setItem(
        "@menu-digital:" + subdomain + ":bag",
        JSON.stringify(newBag)
      );
    }
  }

  async function buscarCEP(cep) {
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      const dadosCEP = response.data;
      setLogradouro(dadosCEP.logradouro);
      setComplemento(dadosCEP.complemento);

      var bairro = bairrosArray.find((entry) => {
        const entryBairro = entry.bairro.toLowerCase();
        const dadosBairro = dadosCEP.bairro.toLowerCase();
        const regex = new RegExp(dadosBairro, "i"); // 'i' para case-insensitive

        return entryBairro === dadosBairro || regex.test(entryBairro);
      });

      if (!isEmpty(bairro)) {
        setBairro(bairro.bairro);
      } else {
        setBairro(dadosCEP.bairro);
      }
      // setCidade(dadosCEP.localidade);
      // setEstado(dadosCEP.uf);

      return dadosCEP;
    } catch (error) {
      return error;
    }
  }

  if (loadingOrder) {
    return <Loading dtcolor={data?.primary_color} />;
  }

  return (
    <>
      <NavbarOrder
        data={data}
        handleOrder={handleOrder}
        subdomain={subdomain}
      />
      <Container maxW="100%" centerContent mt={["80px", "100px"]} mb="30px">
        <Box w="100%">
          <Text color={data?.primary_color} fontSize="20px" fontWeight={600}>
            Carrinho
          </Text>

          <Box
            mt={["8px", "18px"]}
            border="1px solid #CECECE"
            borderRadius={["10px", "20px"]}
            bg="white"
            p={["15px", "23px"]}
            position="relative"
            mb={["20px", "40px"]}
          >
            <Grid templateColumns="1fr" gap={4}>
              <Flex justifyContent="space-between" mb={0}>
                <Text fontSize="sm" fontWeight="600">
                  Itens
                </Text>
                <Text fontSize="sm" fontWeight="600">
                  Preço
                </Text>
              </Flex>

              {bag.map((item, index) => (
                <Box key={index} borderBottom="1px solid #CECECE" pb={4} mb={1}>
                  <Grid templateColumns="1fr auto" gap={0}>
                    <Flex alignItems="center">
                      <Text fontSize="sm" fontWeight="600" color="black">
                        {item.tipo === "P" || item.tipo === "O" ? (
                          <>
                            {item.quantidade}
                            <Text as="span" mx={1} color="gray.500">
                              x
                            </Text>
                            {item.tag}{" "}
                            {item.tamanho !== undefined
                              ? `- ${item.tamanho.tamanho}`
                              : ""}
                          </>
                        ) : (
                          <>
                            {item.quantidade}
                            <Text as="span" mx={1} color="gray.500">
                              x
                            </Text>
                            {item.descricao}
                          </>
                        )}
                      </Text>
                    </Flex>

                    <Flex alignItems="center">
                      <Text fontWeight="600" fontSize="sm" mr="0px">
                        {item.tipo === "P" || item.tipo === "O"
                          ? data?.regra_valor_montagem === "MEDIA"
                            ? moneyFormat.format(
                                item.total / item.sabores.length
                              )
                            : item.sabores
                            ? moneyFormat.format(
                                Math.max.apply(
                                  Math,
                                  item.sabores?.map((o) => o.valor)
                                )
                              )
                            : moneyFormat.format(0)
                          : moneyFormat.format(item.valor_total)}
                      </Text>
                      <IconButton
                        aria-label="Remover item"
                        icon={<Icon as={MdClose} />}
                        size="sm"
                        variant="ghost"
                        colorScheme="red"
                        mr="-10px"
                        onClick={() => updateToCard(index, 0)}
                      />
                    </Flex>
                  </Grid>

                  <Box mt={2} ml={0}>
                    {/* Sabores */}
                    {item.adicional &&
                      item.sabores &&
                      item.sabores.length > 0 && (
                        <Stack spacing={1} mb={2}>
                          {item.sabores.map((element, idx) => (
                            <>
                              <Grid templateColumns="1fr auto" key={idx}>
                                <Text fontSize="sm" color="gray.600">
                                  1/{item.sabores.length} {element.descricao}
                                </Text>
                                <Text fontSize="sm" fontWeight="600">
                                  ***
                                </Text>
                              </Grid>
                              {element?.observacao ? (
                                <Text
                                  fontSize="xs"
                                  display="inline-flex"
                                  alignItems="center"
                                  gap="10px"
                                  fontStyle="italic"
                                  color="#7f8c8d"
                                >
                                  <BsChatRightDots color="#e74c3c" />{" "}
                                  {element.observacao}
                                </Text>
                              ) : null}
                            </>
                          ))}
                        </Stack>
                      )}

                    {/* Adicionais */}
                    {item.adicional && (
                      <Stack spacing={1} mb={2}>
                        {item.adicional
                          .filter((element) => element.id && !element.id_sabor)
                          .map((element, idx) => (
                            <Grid templateColumns="1fr auto" key={idx}>
                              <Text fontSize="sm" color="gray.600">
                                {element.quantidade}
                                <Text as="span" mx={1} color="gray.500">
                                  x
                                </Text>
                                {element.descricao}
                              </Text>
                              <Text fontSize="sm" fontWeight="600">
                                + {moneyFormat.format(element.valor)}
                              </Text>
                            </Grid>
                          ))}
                      </Stack>
                    )}

                    {/* Observações */}
                    {item.observacao_item && (
                      <Text
                        fontSize="xs"
                        fontStyle="italic"
                        color="gray.500"
                        mt={2}
                      >
                        <Text as="span" fontWeight="600">
                          Observações:
                        </Text>{" "}
                        {item.observacao_item}
                      </Text>
                    )}

                    {/* Total */}
                    <Grid
                      templateColumns="repeat(3, 1fr)"
                      gap={2}
                      mt={3}
                      pt={2}
                      borderTop="1px dashed #CECECE"
                    >
                      <Text fontSize="sm" color="gray.700">
                        {item.quantidade} X{" "}
                        {item.tipo === "P" || item.tipo === "O"
                          ? data?.regra_valor_montagem === "MEDIA"
                            ? moneyFormat.format(
                                item.total / item.sabores.length
                              )
                            : item.sabores
                            ? moneyFormat.format(
                                Math.max.apply(
                                  Math,
                                  item.sabores?.map((o) => o.valor)
                                )
                              )
                            : moneyFormat.format(0)
                          : moneyFormat.format(item.valor)}
                      </Text>
                      <Text fontSize="sm" color="gray.700">
                        Adic.{" "}
                        {item.total_adicional
                          ? moneyFormat.format(item.total_adicional)
                          : moneyFormat.format(0)}
                      </Text>
                      <Text fontSize="sm" fontWeight="600" textAlign="right">
                        {moneyFormat.format(item.valor_total)}
                      </Text>
                    </Grid>
                  </Box>
                </Box>
              ))}

              <Button
                onClick={() => router.push(`/lista`)}
                zIndex={1}
                variant="outline"
                fontWeight="600"
                borderColor={data?.primary_color}
                color={data?.primary_color}
                size="sm"
                fontSize="sm"
                w="100%"
                transition="0.3s"
                _hover={{
                  opacity: 0.8,
                }}
                mb="20px"
              >
                Adicionar mais itens
              </Button>

              <Flex justifyContent="space-between">
                <Text fontSize="sm" fontWeight="600">
                  Total
                </Text>
                <Text fontSize="sm" fontWeight="600">
                  {moneyFormat.format(total)}
                </Text>
              </Flex>
            </Grid>
          </Box>

          <Text
            color={data?.primary_color}
            fontSize="20px"
            fontWeight={600}
            mb={["16px", "24px"]}
          >
            Tipo de entrega
          </Text>

          <Flex
            mb="40px"
            alignItems="center"
            justifyContent="space-between"
            bg="#FFECD1"
            borderRadius="7px"
            cursor="pointer"
            h={["40px", "60px"]}
            p="0px 14px"
            transition="0.3s"
            _hover={{
              opacity: 0.8,
            }}
            onClick={() => setOpenTipoEntrega(true)}
          >
            <Flex alignItems="center">
              {delivery == 1 ? (
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
              ) : (
                <Icon fontSize="21px" as={FaWalking} />
              )}
              {delivery == 1 ? (
                <Text
                  ml="15px"
                  mt="2px"
                  fontSize="16px"
                  color="#4D4D4D"
                  fontWeight={600}
                >
                  Entrega
                </Text>
              ) : (
                <Text
                  ml="15px"
                  mt="2px"
                  fontSize="16px"
                  color="#4D4D4D"
                  fontWeight={600}
                >
                  Retirar do local
                </Text>
              )}
            </Flex>

            <Text
              cursor="pointer"
              fontSize={["12px", "16px"]}
              color={data?.primary_color}
              fontWeight={600}
            >
              Alterar
            </Text>
          </Flex>

          {delivery == 2 ? (
            <>
              <Text
                color={data?.primary_color}
                fontSize="20px"
                fontWeight={600}
                mb={["16px", "24px"]}
              >
                Retire seu pedido aqui
              </Text>
              <Box
                borderRadius="20px"
                bg="white"
                border="1px solid #CECECE"
                p="26px 24px"
                mb="40px"
              >
                <Text color="#000" fontSize="16px" fontWeight={600}>
                  {data?.endereco}, {data?.numero} - {data?.bairro},{" "}
                  {data?.cidade}/{data?.estado}
                </Text>
              </Box>
            </>
          ) : (
            <>
              <Text
                color={data?.primary_color}
                fontSize="20px"
                fontWeight={600}
                mb={["16px", "24px"]}
              >
                Endereço
              </Text>

              <FormControl mb="20px">
                <FormLabel>CEP</FormLabel>

                <InputMask
                  alwaysShowMask={false}
                  mask="99999-999"
                  dir="ltl"
                  value={cep}
                  onChange={(e) => {
                    e.target.dir = "ltr";

                    setCep(e.target.value);

                    if (e.target.value.length == 9) {
                      buscarCEP(e.target.value);
                    }
                  }}
                >
                  {() => (
                    <Input
                      placeholder="Digite seu CEP"
                      bg="white"
                      color="#4D4D4D"
                      fontSize="16px"
                      fontWeight={600}
                      _focusVisible={{
                        borderColor: `${data?.primary_color} !important`,
                        boxShadow: "0px",
                      }}
                      type="text"
                    />
                  )}
                </InputMask>
              </FormControl>

              <Flex gap="20px">
                <FormControl mb="20px">
                  <FormLabel>
                    Endereço{" "}
                    <Text as="span" color="red">
                      *
                    </Text>
                  </FormLabel>

                  <Input
                    placeholder="Digite seu endereço"
                    bg="white"
                    color="#4D4D4D"
                    fontSize="16px"
                    fontWeight={600}
                    _focusVisible={{
                      borderColor: `${data?.primary_color} !important`,
                      boxShadow: "0px",
                    }}
                    type="text"
                    value={logradouro}
                    onChange={(e) => setLogradouro(e.target.value)}
                  />
                </FormControl>

                <FormControl w="40%" mb="20px">
                  <FormLabel>
                    Número{" "}
                    <Text as="span" color="red">
                      *
                    </Text>
                  </FormLabel>

                  <Input
                    bg="white"
                    color="#4D4D4D"
                    fontSize="16px"
                    fontWeight={600}
                    _focusVisible={{
                      borderColor: `${data?.primary_color} !important`,
                      boxShadow: "0px",
                    }}
                    type="number"
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                  />
                </FormControl>
              </Flex>

              <FormControl mb="20px">
                <FormLabel>Complemento</FormLabel>

                <Input
                  placeholder="Digite seu complemnto"
                  bg="white"
                  color="#4D4D4D"
                  fontSize="16px"
                  fontWeight={600}
                  _focusVisible={{
                    borderColor: `${data?.primary_color} !important`,
                    boxShadow: "0px",
                  }}
                  type="text"
                  value={complemento}
                  onChange={(e) => setComplemento(e.target.value)}
                />
              </FormControl>

              <FormControl mb="20px">
                <FormLabel>
                  Bairro{" "}
                  <Text as="span" color="red">
                    *
                  </Text>
                </FormLabel>

                <Select
                  id="bairro"
                  name="bairro"
                  bg="white"
                  color="#4D4D4D"
                  fontSize="16px"
                  fontWeight={600}
                  _focusVisible={{
                    borderColor: `${data?.primary_color} !important`,
                    boxShadow: "0px",
                  }}
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                >
                  {bairrosArray.map((item, key) => (
                    <option value={item.bairro} key={key}>
                      {item.bairro} {moneyFormat.format(item.valor)}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <Flex gap="20px">
                <FormControl mb="20px">
                  <FormLabel>
                    Cidade{" "}
                    <Text as="span" color="red">
                      *
                    </Text>
                  </FormLabel>

                  <Input
                    placeholder="Digite sua cidade"
                    bg="white"
                    color="#4D4D4D"
                    fontSize="16px"
                    fontWeight={600}
                    _focusVisible={{
                      borderColor: `${data?.primary_color} !important`,
                      boxShadow: "0px",
                    }}
                    type="text"
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    disabled
                  />
                </FormControl>

                <FormControl w="40%" mb="20px">
                  <FormLabel>
                    Estado{" "}
                    <Text as="span" color="red">
                      *
                    </Text>
                  </FormLabel>

                  <Select
                    id="estado"
                    name="estado"
                    bg="white"
                    color="#4D4D4D"
                    fontSize="16px"
                    fontWeight={600}
                    _focusVisible={{
                      borderColor: `${data?.primary_color} !important`,
                      boxShadow: "0px",
                    }}
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    disabled
                  >
                    <option value="AC">AC</option>
                    <option value="AL">AL</option>
                    <option value="AM">AM</option>
                    <option value="AP">AP</option>
                    <option value="BA">BA</option>
                    <option value="CE">CE</option>
                    <option value="DF">DF</option>
                    <option value="GO">GO</option>
                    <option value="ES">ES</option>
                    <option value="MA">MA</option>
                    <option value="MG">MG</option>
                    <option value="MS">MS</option>
                    <option value="MT">MT</option>
                    <option value="PA">PA</option>
                    <option value="PB">PB</option>
                    <option value="PE">PE</option>
                    <option value="PI">PI</option>
                    <option value="PR">PR</option>
                    <option value="RJ">RJ</option>
                    <option value="RN">RN</option>
                    <option value="RO">RO</option>
                    <option value="RR">RR</option>
                    <option value="RS">RS</option>
                    <option value="SC">SC</option>
                    <option value="SE">SE</option>
                    <option value="SP">SP</option>
                    <option value="TO">TO</option>
                  </Select>
                </FormControl>
              </Flex>

              {msgErrorEndereco != "" && (
                <Alert status="warning" mb="20px" mt="10px">
                  <AlertIcon />
                  {msgErrorEndereco}
                </Alert>
              )}
            </>
          )}

          <Text
            color={data?.primary_color}
            fontSize="20px"
            fontWeight={600}
            mb={["16px", "24px"]}
          >
            Meus dados
          </Text>

          <FormControl mb="30px">
            <FormLabel color="#000" fontSize="16px" fontWeight={600}>
              Qual o seu nome?{" "}
              <Text as="span" color="#FF0F0F">
                *
              </Text>
            </FormLabel>
            <Input
              color="#000"
              fontSize="14px"
              fontWeight="normal"
              size="lg"
              borderColor="#E4E4E4"
              borderRadius="7px"
              bg="white"
              type="text"
              placeholder="Escreva o seu nome aqui..."
              _focusVisible={{
                borderColor: `${data?.primary_color} !important`,
                boxShadow: "0px",
              }}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormControl>

          <FormControl mb="30px">
            <FormLabel color="#000" fontSize="16px" fontWeight={600}>
              Seu telefone{" "}
              <Text as="span" color="#FF0F0F">
                *
              </Text>
            </FormLabel>

            <InputMask
              alwaysShowMask={false}
              maskChar=""
              mask="(99) 99999-9999"
              dir="ltl"
              value={phone}
              onChange={(e) => {
                e.target.dir = "ltr";

                setPhone(e.target.value);
              }}
            >
              {() => (
                <Input
                  color="#000"
                  fontSize="14px"
                  fontWeight="normal"
                  size="lg"
                  borderColor="#E4E4E4"
                  borderRadius="7px"
                  bg="white"
                  type="text"
                  placeholder="Escreva o seu telefone aqui..."
                  inputmode="numeric"
                  _focusVisible={{
                    borderColor: `${data?.primary_color} !important`,
                    boxShadow: "0px",
                  }}
                />
              )}
            </InputMask>
          </FormControl>

          <Text mb="10px" color="#000" fontSize="16px" fontWeight={600}>
            Como você irá pagar?{" "}
            <Text as="span" color="#FF0F0F">
              *
            </Text>
          </Text>

          <Flex
            mb="30px"
            alignItems="center"
            justifyContent="space-between"
            bg="#D7FFD1"
            borderRadius="7px"
            cursor="pointer"
            h={["40px", "60px"]}
            p="0px 14px"
            transition="0.3s"
            _hover={{
              opacity: 0.8,
            }}
            onClick={() => setOpenFormaPg(true)}
          >
            <Flex alignItems="center">
              {order?.forma == "CARTÃO DE CREDITO" ||
              order?.forma == "CARTÃO DE DEBITO" ||
              !order?.forma ? (
                <Icon fontSize="21px" as={BsCreditCard2Back} />
              ) : (
                <Icon as={MdOutlineAttachMoney} fontSize="21px" />
              )}

              <Text
                ml="15px"
                mt="2px"
                fontSize="16px"
                color="#4D4D4D"
                fontWeight={600}
              >
                {!order?.forma ? "Forma de pagamento" : order?.forma}
              </Text>
            </Flex>

            <Text
              cursor="pointer"
              fontSize={["12px", "16px"]}
              color="#000"
              opacity="0.7"
              fontWeight={600}
            >
              Selecionar
            </Text>
          </Flex>

          <FormControl mb="20px">
            <FormLabel color="#000" fontSize="16px" fontWeight={600}>
              Observações
            </FormLabel>
            <Textarea
              color="#000"
              rows={4}
              fontSize="14px"
              fontWeight="normal"
              size="lg"
              borderColor="#E4E4E4"
              borderRadius="7px"
              bg="white"
              type="text"
              _focusVisible={{
                borderColor: `${data?.primary_color} !important`,
                boxShadow: "0px",
              }}
              onChange={(e) => setNote(e.target.value)}
              value={note}
            />
          </FormControl>

          <Text
            color={data?.primary_color}
            fontSize="20px"
            fontWeight={600}
            textAlign="center"
            mb={["16px", "24px"]}
          >
            Totais
          </Text>
          <Flex
            alignItems="center"
            justifyContent="space-between"
            mb="4px"
            borderBottom="1px solid rgb(232, 234, 237)"
            p="0.5rem"
          >
            <Text fontSize="16px" color="#000">
              Produtos
            </Text>
            <Text fontSize="16px" color="#000">
              {bag.length > 0 && moneyFormat.format(total)}
            </Text>
          </Flex>
          <Flex
            alignItems="center"
            justifyContent="space-between"
            mb="4px"
            borderBottom="1px solid rgb(232, 234, 237)"
            p="0.5rem"
          >
            <Text fontSize="16px" color="#000">
              Taxa de entrega
            </Text>
            <Text fontSize="16px" color="#000">
              {order.valor_taxa !== undefined
                ? moneyFormat.format(order.valor_taxa)
                : moneyFormat.format(0)}
            </Text>
          </Flex>
          <Flex
            alignItems="center"
            justifyContent="space-between"
            mb="4px"
            borderBottom="1px solid rgb(232, 234, 237)"
            p="0.5rem"
          >
            <Text fontSize="16px" fontWeight="600" color="#000">
              Valor Total
            </Text>
            <Text fontSize="16px" fontWeight="600" color="#000">
              {moneyFormat.format(valorTotal)}
            </Text>
          </Flex>
          {order.valor_para_troco !== undefined && (
            <Flex
              alignItems="center"
              justifyContent="space-between"
              mb="4px"
              borderBottom="1px solid rgb(232, 234, 237)"
              p="0.5rem"
            >
              <Text fontSize="16px" fontWeight="600" color="#000">
                Troco para
              </Text>
              <Text fontSize="16px" fontWeight="600" color="#000">
                {moneyFormat.format(order.valor_para_troco)}
              </Text>
            </Flex>
          )}
          {cupomDesconto != 0 && (
            <Flex
              alignItems="center"
              justifyContent="space-between"
              mb="4px"
              borderBottom="1px solid rgb(232, 234, 237)"
              p="0.5rem"
            >
              <Text fontSize="16px" fontWeight="600" color="#000">
                Cupom de desconto
              </Text>
              <Text fontSize="16px" fontWeight="600" color="#000">
                {moneyFormat.format(cupomDesconto)}
              </Text>
            </Flex>
          )}

          <InputGroup size="lg" mt="20px">
            <InputLeftElement>
              <Icon as={MdOutlineCardGiftcard} />
            </InputLeftElement>
            <Input
              onChange={(e) => setCoupon(e.target.value)}
              placeholder="Digite um cupom"
              bg="white"
              color="#4D4D4D"
              fontSize="16px"
              isDisabled={cupomValidarLoading || cupomDesconto != 0}
              value={coupon}
              fontWeight={600}
              _focusVisible={{
                borderColor: `${data?.primary_color} !important`,
                boxShadow: "0px",
              }}
            />
            <InputRightElement pr="40px">
              <Text
                color={data?.primary_color}
                fontSize="16px"
                fontWeight={600}
                cursor="pointer"
                pointerEvents={
                  cupomValidarLoading || cupomDesconto != 0 ? "none" : "initial"
                }
                onClick={() =>
                  validarCupom({
                    userId: data.user_id,
                    cupom: coupon,
                    valorcompra:
                      total +
                      (order.valor_taxa !== undefined && delivery === 1
                        ? order.valor_taxa
                        : 0),
                  })
                }
              >
                Aplicar
              </Text>
            </InputRightElement>
          </InputGroup>
          {cupomValidarFeedback != "" && (
            <Text fontSize="xs" color="primary">
              {cupomValidarFeedback}
            </Text>
          )}
        </Box>
      </Container>

      <DrawerFormaPg
        setOpenFormaPg={setOpenFormaPg}
        openFormaPg={openFormaPg}
        subdomain={subdomain}
        setOrder={setOrder}
        order={order}
        total={total}
        data={data}
      />

      <Drawer
        placement="bottom"
        onClose={() => setOpenTipoEntrega(false)}
        isOpen={openTipoEntrega}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader
            position="relative"
            borderBottomWidth="1px"
            textAlign="center"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            Escolha o tipo de entrega
          </DrawerHeader>
          <DrawerBody minH="100px" bg="rgb(243, 245, 247)">
            <RadioGroup
              mt="12px"
              defaultValue={delivery}
              onChange={(e) => {
                setDelivery(e);
                try {
                  if (typeof window !== "undefined") {
                    localStorage.setItem(
                      "orderMode",
                      e === "2" ? "retirada" : "entrega"
                    );
                  }
                } catch (_) {}
                setOpenTipoEntrega(false);
              }}
            >
              <Stack gap="15px">
                <Radio
                  size="md"
                  name="delivery"
                  value="1"
                  defaultChecked
                  colorScheme="blue"
                >
                  Entrega
                </Radio>
                <Radio size="md" name="delivery" value="2" colorScheme="blue">
                  Retirar do local
                </Radio>
              </Stack>
            </RadioGroup>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

function mapState(state) {
  const { bairros, couponsValidar } = state;
  return { bairros, couponsValidar };
}

const actionCreators = {
  getAllBairros: bairrosActions.getAll,
  createPedido: pedidoActions.create,
  createPedidoUser: pedidoUserActions.create,
  validarCupom: couponsActions.validarCupom,
};

export default connect(mapState, actionCreators)(OrderContext);
