import logo from "./logo.svg";
import "./App.css";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme";
import Home from "./components/home";
import Navbar from "./components/navbar";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Home />;
    </ChakraProvider>
  );
}

export default App;
