import { IconButton, IconButtonProps } from "@chakra-ui/react";
import BagSquareIcon from "../icons/BagSquareIcon";

const BTN_SIZE = 44; // tamanho do botão (igual nas duas páginas)
const ICON_SIZE = 20; // tamanho do ícone (igual nas duas páginas)

export default function CartIconButton(
  props: Omit<IconButtonProps, "icon" | "aria-label">
) {
  return (
    <IconButton
      aria-label="Abrir sacola"
      icon={<BagSquareIcon size={ICON_SIZE} />}
      w={`${BTN_SIZE}px`}
      h={`${BTN_SIZE}px`}
      minW={`${BTN_SIZE}px`}
      minH={`${BTN_SIZE}px`}
      rounded="full"
      bg="white"
      color="gray.900"
      border="1px solid"
      borderColor="gray.200"
      boxShadow="sm"
      _hover={{ bg: "gray.50" }}
      _active={{ bg: "gray.100" }}
      {...props}
    />
  );
}
