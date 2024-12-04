import React from "react";
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Button,
  Box,
  Text,
  VStack,
  HStack,
  IconButton,
  Image,
} from "@chakra-ui/react";
import { AddIcon, MinusIcon, CloseIcon } from "@chakra-ui/icons";

const ItemCarrinho = ({ title, year, price, onIncrease, onDecrease, quantity, capa, days, remove }) => (
  <HStack spacing={4} borderBottom="1px" borderColor="gray.200" py={4}>
    <Box w="200px" h="300px" bg="gray.300" borderRadius="md">
      <Image src={capa} alt={title} width={"200px"} height={"300px"} />
    </Box>
    <Box width={"100%"} height={"100%"}>
      <VStack align="start" display={"grid"}>
        <IconButton aria-label="Remove item" icon={<CloseIcon />} size="sm" alignSelf={"end"} justifySelf={"end"} onClick={remove} colorScheme="red" />
        <Text fontSize="lg" fontWeight="bold">
          {title}
        </Text>
        <Text color="gray.600">{year}</Text>
        <HStack>
          <Text>Dias: {days} </Text>
          <IconButton icon={<MinusIcon />} onClick={onDecrease} isDisabled={quantity <= 1} variant="outline" />
          <Text>{quantity}</Text>
          <IconButton icon={<AddIcon />} onClick={onIncrease} variant="outline" />
        </HStack>

        <Text>{`R$ ${(price * days).toFixed(2)}`}</Text>
      </VStack>
    </Box>
  </HStack>
);

const Carrinho = ({ isOpen, onClose, carrinho, setCarrinho, user }) => {
  const total = carrinho.reduce((sum, item) => sum + item.preco * item.days, 0);
  console.log(carrinho);
  const enviarPedido = () => {
    const filmes = carrinho.map((item) => ({
      idFilme: item.id,
      quantidade: item.days,
      preco: item.preco,
    }));

    fetch("http://localhost:3001/api/pedidos/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: user.token,
      },
      body: JSON.stringify({ filmes: filmes }),
    })
      .then((response) => response.json())
      //.then(setCarrinho([]))
      .catch((error) => console.error("Error posting data:", error));
    setCarrinho([]);
  };

  const onIncrease = (id) => {
    setCarrinho((prev) => prev.map((item) => (item.id === id ? { ...item, days: item.days + 1 } : item)));
  };

  const onDecrease = (id) => {
    setCarrinho((prev) => prev.map((item) => (item.id === id && item.days > 1 ? { ...item, days: item.days - 1 } : item)));
  };

  const remove = (id) => {
    setCarrinho(
      (prev) => prev.filter((item) => item.id !== id) // Remove items with 0 days
    );
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} placement="right" size="sm">
      <DrawerOverlay>
        <DrawerContent bg="white">
          <DrawerCloseButton />
          <DrawerHeader>
            <Text fontSize="3xl" fontWeight="bold" mb={4}>
              CARRINHO
            </Text>
          </DrawerHeader>
          <DrawerBody>
            {carrinho.map((item) => (
              <ItemCarrinho
                key={item.id}
                title={item.titulo}
                year={item.ano}
                price={item.preco}
                onIncrease={() => onIncrease(item.id)}
                onDecrease={() => onDecrease(item.id)}
                remove={() => remove(item.id)}
                quantity={item.quantity}
                capa={item.capa}
                days={item.days}
              />
            ))}
            <HStack justify="space-between" mt={4}>
              <Text fontSize="xl" fontWeight="bold">
                TOTAL: R$ {total.toFixed(2)}
              </Text>
              <Button colorScheme="blue" size="lg" onClick={enviarPedido} isDisabled={!user || carrinho.length == 0}>
                Alugar
              </Button>
            </HStack>
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};

export default Carrinho;
