import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
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
      <Drawer
        placement="bottom"
        onClose={() => setOpenFormaPg(false)}
        isOpen={openFormaPg}
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
            fontFamily="var(--font-poppins), system-ui, -apple-system, sans-serif"
            fontWeight={700}
            fontSize="14px"
          >
            Forma de pagamento
          </DrawerHeader>
          <DrawerBody minH="100px" bg="rgb(243, 245, 247)">
            <RadioGroup mt="12px" value={parseInt(forma)} onChange={setForma}>
              <Stack>
                {formasPgData.map((item, index) => (
                  <Radio
                    key={index}
                    size="md"
                    value={parseInt(item.id)}
                    colorScheme="blue"
                    fontFamily="var(--font-poppins), system-ui, -apple-system, sans-serif"
                    fontSize="14px"
                  >
                    {item.descricao}
                  </Radio>
                ))}
              </Stack>
            </RadioGroup>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Modal isOpen={isOpen} onClose={handleCloseModalTroco}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{formaSelectedData?.descricao}</ModalHeader>
          <ModalCloseButton />
          <ModalBody bg="rgb(243, 245, 247)">
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
                    component={FormField.InputMoney}
                    error={errors.troco}
                  />
                </Form>
              )}
            </Formik>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={handleCloseModalTroco}>
              Fechar
            </Button>
            <Button
              form="formTroco"
              type="submit"
              variant="btnDallas"
              color="white"
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
