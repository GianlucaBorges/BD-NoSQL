import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    white: {
      100: "#FFFFFF", // Pure white
      200: "#F8F9FA", // Light grayish-white for backgrounds
    },
    blue: {
      500: "#4285F4", // Primary Google-like blue
      600: "#357AE8", // Slightly darker blue for hover or active states
    },
    gray: {
      300: "#E0E0E0", // Neutral gray for borders or dividers
      500: "#9E9E9E", // Medium gray for secondary text
    },
  },
});

export default theme;
