import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { formasPgActions } from "../../store/actions";
import { isEmpty } from "lodash";
import { Field, Form, Formik } from "formik";
import FormField from "../FormField/FormField";

function DrawerFormaPg({
  setOpenFormaPg,
  openFormaPg,
  formasPg,
  subdomain,
  getAllFormasPg,
  setOrder,
  order,
  data,
  total,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [forma, setForma] = useState("");
  const [formaSelectedData, setFormaSelectedData] = useState({});
  const [formasPgData, setFormasPgData] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    if (isEmpty(formasPg) && openFormaPg) {
      setFormasPgData([]);
      setIsLoading(false);
      getAllFormasPg(data.user_id);
    }
  }, [openFormaPg]);

  useEffect(() => {
    if (formasPg.items) {
      setFormasPgData(formasPg.items);
      setIsLoading(false);
    } else {
      setFormasPgData([]);
    }

    if (formasPg.loading) {
      setIsLoading(formasPg.loading);
    }
  }, [formasPg]);

  useEffect(() => {
    if (!openFormaPg) {
      return;
    }

    const formaPgSelected = formasPgData.find((entry) => entry.id == forma);

    if (formaPgSelected?.requer_troco) {
      setFormaSelectedData(formaPgSelected);
      onOpen();
    } else {
      setOrder({
        ...order,
        id_forma: formaPgSelected?.id,
        forma: formaPgSelected?.descricao,
      });

      setOpenFormaPg(false);
    }
  }, [forma]);

  const handleCloseModalTroco = () => {
    if (
      document.getElementById("troco").value != "" &&
      document.getElementById("troco").value != "R$ 0,00"
    ) {
      setForma("");
      onClose();
    } else {
      setForma("");
      onClose();
    }
  };

  return (
    <>
      <Modal isOpen={openFormaPg} onClose={() => setOpenFormaPg(false)} isCentered>
        <ModalOverlay />
        <ModalContent
          className="mp-rounded-modal"
          maxW="420px"
          w="88vw"
          borderRadius="24px"
          boxShadow="0 10px 30px rgba(17, 24, 39, 0.12)"
        >
          <ModalBody
            minH="100px"
            bg="white"
            display="flex"
            flexDirection="column"
            alignItems="center"
            px="24px"
            py="20px"
          >
            <Text
              fontFamily="var(--font-poppins), system-ui, -apple-system, sans-serif"
              fontWeight={700}
              fontSize="16px"
              mb="12px"
              textAlign="center"
              color="#111827"
            >
              Forma de pagamento
            </Text>
            <RadioGroup value={parseInt(forma)} onChange={setForma} w="100%">
              <Stack align="center" spacing={4}>
                {formasPgData.map((item, index) => (
                  <Radio
                    key={index}
                    size="md"
                    value={parseInt(item.id)}
                    colorScheme="blue"
                    fontFamily="var(--font-poppins), system-ui, -apple-system, sans-serif"
                    fontSize="14px"
                  >
                    <Text textAlign="center" w="100%" fontSize="14px">
                      {item.descricao}
                    </Text>
                  </Radio>
                ))}
              </Stack>
            </RadioGroup>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpen} onClose={handleCloseModalTroco} isCentered>
        <ModalOverlay />
        <ModalContent
          className="mp-rounded-modal"
          maxW="420px"
          w="88vw"
          borderRadius="24px"
          boxShadow="0 10px 30px rgba(17, 24, 39, 0.12)"
        >
          <ModalHeader
            textAlign="center"
            fontFamily="var(--font-poppins), system-ui, -apple-system, sans-serif"
            fontWeight={700}
            fontSize="14px"
            pb="8px"
          >
            {formaSelectedData?.descricao}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            bg="white"
            px="24px"
            pb="12px"
            fontFamily="var(--font-poppins), system-ui, -apple-system, sans-serif"
          >
            <Formik
              enableReinitialize
              initialErrors={{}}
              initialValues={{
                troco: "0,00",
              }}
              onSubmit={(values) => {
                let valueFinal = values.troco
                  ? values.troco.replaceAll("R$ ", "")
                  : "0,00";

                if (valueFinal == "0,00") {
                  return toast({
                    title: "Alerta",
                    description: `Adicione o valor para troco`,
                    status: "warning",
                    duration: 2000,
                    isClosable: true,
                    position: "bottom-center",
                  });
                }

                if (
                  formaSelectedData?.requer_troco &&
                  valueFinal !== undefined
                ) {
                  let troco = Number(valueFinal.replace(",", "."));
                  if (troco < total) {
                    toast({
                      title: "Alerta",
                      description: `Valor inferior ao total do pedido`,
                      status: "warning",
                      duration: 2000,
                      isClosable: true,
                      position: "bottom-center",
                    });
                  } else {
                    setOrder({
                      ...order,
                      id_forma: formaSelectedData?.id,
                      forma: formaSelectedData?.descricao,
                      valor_para_troco: valueFinal.replace(",", "."),
                    });

                    onClose();
                    setOpenFormaPg(false);
                  }
                }
              }}
            >
              {({ errors }) => (
                <Form id="formTroco">
                  <Field
                    id="troco"
                    name="troco"
                    type="text"
                    placeholder="Valor para troco"
                    labelProps={{ textAlign: 'center', fontSize: '12px', fontWeight: 600, mb: '10px', color: '#111827' }}
                    component={FormField.InputMoney}
                    error={errors.troco}
                  />
                </Form>
              )}
            </Formik>
          </ModalBody>

          <ModalFooter
            px="24px"
            pb="20px"
          >
            <Button mr={3} onClick={handleCloseModalTroco} borderRadius="9999px">
              Fechar
            </Button>
            <Button
              form="formTroco"
              type="submit"
              bg={data?.primary_color || "#CF3F2E"}
              color="white"
              borderRadius="9999px"
              px="24px"
              _hover={{ opacity: 0.9, bg: data?.primary_color || "#CF3F2E" }}
            >
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

function mapState(state) {
  const { formasPg } = state;
  return { formasPg };
}

const actionCreators = {
  getAllFormasPg: formasPgActions.getAll,
};

export default connect(mapState, actionCreators)(DrawerFormaPg);
