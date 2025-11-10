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
        _focusVisible: {
          boxShadow: "none",
        },
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
    IconButton: {
      baseStyle: {
        _focusVisible: {
          boxShadow: "none",
        },
      },
    },
    Link: {
      baseStyle: {
        _focusVisible: {
          boxShadow: "none",
        },
      },
    },
    Input: {
      baseStyle: {
        field: {
          _focusVisible: {
            boxShadow: "none",
            borderColor: "inherit",
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
      "*, *::before, *::after": {
        WebkitTapHighlightColor: "transparent",
      },
      "button:focus:not(:focus-visible), [role='button']:focus:not(:focus-visible), a:focus:not(:focus-visible), input:focus:not(:focus-visible), [tabindex]:focus:not(:focus-visible)":
        {
          outline: "none !important",
          boxShadow: "none !important",
        },
    }),
  },
  shadows: {
    outline: "0 0 0 0 rgba(0,0,0,0)",
  },
  colors: {
    primary: "#1E90FF",
    secondary: "#1577BE",
  },
});

export default theme;
