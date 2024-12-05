import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  FormControl,
  FormLabel,
  useDisclosure,
  VStack,
  HStack,
  Box,
  Text,
  Grid,
  Table,
  Tr,
  Thead,
  Th,
  Tbody,
  Td,
} from "@chakra-ui/react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";

const ModalLogin = ({ isOpen, onClose, user, setUser, GetCarrinhoRedis, saveUserLocalStorage, salvarCarrinhoRedis }) => {
  const [cadastrar, setCadastrar] = useState(false);
  const [historico, setHistorico] = useState([]);
  const [formValues, setFormValues] = useState({
    email: "",
    nome: "",
    senha: "",
  });
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  function trocarLoginCadastro() {
    setCadastrar((prevCadastrar) => !prevCadastrar); // This is the proper way to toggle a boolean
  }

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:3001/api/pedidos`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: user.token,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            console.log(data);
            setHistorico(data || []);
          }
        })
        .catch((error) => console.error("Error fetching historico de Pedidos:", error));
    }
  }, [user]);

  function fazerLoginOuCadastro() {
    if (cadastrar) {
      fetch("http://localhost:3001/api/Usuarios/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: formValues.nome,
          email: formValues.email,
          senha: formValues.senha,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setUser(data.usuario);
          saveUserLocalStorage(data.usuario);
        })
        .catch((error) => console.error("Error Login:", error));
    } else {
      fetch("http://localhost:3001/api/Usuarios/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formValues.email,
          senha: formValues.senha,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setUser(data);
          saveUserLocalStorage(data);
        })
        .catch((error) => console.error("Error Login:", error));
    }
  }

  function disconect() {
    salvarCarrinhoRedis();

    localStorage.removeItem("user");
    setUser(false);
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size={"xl"}>
      <ModalOverlay />
      <ModalContent bg={"white"}>
        <ModalHeader>{user ? user.Nome : "Login"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {user && (
            <VStack spacing={4} alignItems={"start"}>
              <Text fontWeight={"bold"} fontSize={16}>
                Olá {user.nome}
              </Text>
              <Text fontWeight={"bold"}> Pedidos:</Text>
              {historico &&
                historico.length > 0 &&
                historico?.map((pedido) => (
                  <Box width={"100%"}>
                    <HStack fontWeight={"bold"}>
                      <Text marginRight={"10%"}>Pedido feito em: {new Date(pedido.itens[0].dataPedido).toLocaleDateString()}</Text>
                      <Text>Total do pedido: R$ {pedido.total}</Text>
                    </HStack>
                    <Text fontWeight={"bold"}>Filmes Alugados: </Text>

                    <Table textAlign={"start"}>
                      <Thead>
                        <Tr>
                          <Th>Título</Th>
                          <Th>Preço</Th>
                          <Th>Data de devolução</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {pedido.itens?.map((filme) => (
                          <Tr>
                            <Td>{filme.titulo}</Td>
                            <Td>R$ {filme.preco}</Td>
                            <Td>{new Date(filme.dataDevolucao).toLocaleDateString()}</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>
                ))}
            </VStack>
          )}
          {!user && (
            <VStack spacing={4}>
              {cadastrar && (
                <FormControl>
                  <FormLabel>Nome Completo</FormLabel>
                  <Input name="nome" value={formValues.nome} onChange={handleChange} placeholder="Nome Completo" />
                </FormControl>
              )}
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input name="email" value={formValues.email} onChange={handleChange} placeholder="Email" type="email" />
              </FormControl>
              <FormControl>
                <FormLabel>Senha</FormLabel>
                <Input name="senha" value={formValues.senha} onChange={handleChange} placeholder="Senha" type="password" />
              </FormControl>
            </VStack>
          )}
        </ModalBody>

        <ModalFooter>
          {!user && (
            <Button variant="ghost" onClick={trocarLoginCadastro}>
              {cadastrar ? "Login" : "Cadastrar"}
            </Button>
          )}

          <Button colorScheme="blue" ml={3} onClick={user ? disconect : fazerLoginOuCadastro}>
            {user ? "Desconectar" : cadastrar ? "Cadastrar" : "Login"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ModalLogin;
