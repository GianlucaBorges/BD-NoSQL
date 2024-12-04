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
  Text,
} from "@chakra-ui/react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";

const ModalLogin = ({ isOpen, onClose, user, setUser, GetCarrinhoRedis, saveUserLocalStorage }) => {
  const [cadastrar, setCadastrar] = useState(false);
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

  const pegaHistorico = () => {
    // fetch(`http://localhost:3001/api/pedidos?key=carrinhos-${chave}`)
    //   .then((response) => response.json())
    //   .then((data) => {
    //     if (data) {
    //       setCarrinho(data || []);
    //     }
    //   })
    //   .catch((error) => console.error("Error fetching carrinhos:", error));
  };

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
        .catch((error) => console.error("Error Login:", error))
        .finally(() => GetCarrinhoRedis());
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
        .catch((error) => console.error("Error Login:", error))
        .finally(() => GetCarrinhoRedis());
    }
  }

  function disconect() {
    setUser(false);
    localStorage.removeItem("user");
    GetCarrinhoRedis();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bg={"white"}>
        <ModalHeader>{user ? user.Nome : "Login"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {user && (
            <VStack spacing={4} alignItems={"start"}>
              <Text>Olá {user.nome}</Text>
              <Text> Pedidos:</Text>
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
