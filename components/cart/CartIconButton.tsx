import { IconButton, IconButtonProps } from "@chakra-ui/react";

const BTN_SIZE = 44;

export default function CartIconButton(
  props: Omit<IconButtonProps, "icon" | "aria-label">
) {
  return (
    <IconButton
      aria-label="Abrir sacola"
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
    >
      <img
        src="/img/bag-icon.svg"
        alt="Abrir sacola"
        width={20}
        height={20}
        style={{ display: "block" }}
      />
    </IconButton>
  );
}
