import React, { useState, useEffect } from "react";
import { Box, Flex, Input, IconButton, Icon, SimpleGrid, Image, Text, Heading } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { FaUser } from "react-icons/fa";

const Navbar = ({ toggleCarrinho, toggleModalLogin, setSearchValue, fetchMovies }) => {
  const [barraDePesquisa, setBarraDePesquisa] = useState("");
  function Pesquisar() {
    fetchMovies(barraDePesquisa);
  }
  const handleChange = (event) => {
    setBarraDePesquisa(event.target.value);
  };
  return (
    <Box bg="grey" color={"black"} minH="10vh" p={4}>
      <Flex justify="space-between" align="center" pb={4}>
        <Heading>RetroFilme</Heading>
        <Flex>
          <Input
            value={barraDePesquisa}
            onChange={handleChange}
            placeholder="Busque por um filme..."
            variant="filled"
            borderRadius="md"
            bg={"white"}
            _focus={{ bg: "white" }}
          />
          <IconButton onClick={Pesquisar} aria-label="Search" icon={<SearchIcon />} ml={2} bg="blue.600" _hover={{ bg: "orange.600" }} />
        </Flex>

        <Flex>
          <IconButton
            aria-label="Shopping Cart"
            fontSize={"30px"}
            icon={
              <Icon viewBox="0 0 24 24">
                <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M5.00014 14H18.1359C19.1487 14 19.6551 14 20.0582 13.8112C20.4134 13.6448 20.7118 13.3777 20.9163 13.0432C21.1485 12.6633 21.2044 12.16 21.3163 11.1534L21.9013 5.88835C21.9355 5.58088 21.9525 5.42715 21.9031 5.30816C21.8597 5.20366 21.7821 5.11697 21.683 5.06228C21.5702 5 21.4155 5 21.1062 5H4.50014M2 2H3.24844C3.51306 2 3.64537 2 3.74889 2.05032C3.84002 2.09463 3.91554 2.16557 3.96544 2.25376C4.02212 2.35394 4.03037 2.48599 4.04688 2.7501L4.95312 17.2499C4.96963 17.514 4.97788 17.6461 5.03456 17.7462C5.08446 17.8344 5.15998 17.9054 5.25111 17.9497C5.35463 18 5.48694 18 5.75156 18H19M7.5 21.5H7.51M16.5 21.5H16.51M8 21.5C8 21.7761 7.77614 22 7.5 22C7.22386 22 7 21.7761 7 21.5C7 21.2239 7.22386 21 7.5 21C7.77614 21 8 21.2239 8 21.5ZM17 21.5C17 21.7761 16.7761 22 16.5 22C16.2239 22 16 21.7761 16 21.5C16 21.2239 16.2239 21 16.5 21C16.7761 21 17 21.2239 17 21.5Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Icon>
            }
            size="lg"
            onClick={toggleCarrinho}
            color={"white"}
            bg={"transparent"}
            sx={{
              _hover: {
                background: "none", // Remove background change
                color: "inherit", // Remove color change (optional)
              },
            }}
            p={5}
          />
          <IconButton
            fontSize={"30px"}
            sx={{
              _hover: {
                background: "none", // Remove background change
                color: "inherit", // Remove color change (optional)
              },
            }}
            aria-label="User"
            bg={"transparent"}
            icon={<FaUser />}
            size="lg"
            color={"white"}
            onClick={toggleModalLogin}
          />
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;
