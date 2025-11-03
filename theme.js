import { extendTheme } from "@chakra-ui/react";
import "typeface-roboto";

const config = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const theme = extendTheme({
  components: {
    Button: {
      baseStyle: {
        borderRadius: "base",
      },
      variants: {
        btnDallas: {
          bg: "linear-gradient(140deg, #1E90FF 0%, #1577BE 100%)",
          _hover: {
            background: "linear-gradient(140deg, #1E90FF 0%, #1577BE 100%)",
            opacity: 1,
          },
        },
      },
    },
    Th: {
      baseStyle: {
        fontWeight: "400",
      },
    },
  },
  config,
  fonts: {
    heading:
      'var(--font-poppins), system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, sans-serif',
    body: 'var(--font-poppins), system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  styles: {
    global: () => ({
      body: {
        bg: "#FBFBFB",
      },
    }),
  },
  colors: {
    primary: "#1E90FF",
    secondary: "#1577BE",
  },
});

export default theme;
