import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  HStack,
  IconButton,
  VStack,
} from "@chakra-ui/react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";

const ModalFilme = ({ isOpen, onClose, movie, setCarrinho, carrinho }) => {
  const [days, setDays] = useState(1);

  async function handleConfirm() {
    movie.days = days;
    setCarrinho((carrinho) => [...carrinho, movie]);
    onClose();
    setDays(1);
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent bg="white" color="black">
        <ModalHeader>{movie.titulo}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <HStack>
            <VStack alignItems={"start"}>
              <Text>
                <b>Diretores(as):</b> {movie.diretores}
              </Text>
              <Text>
                <b>Ano de lançamento:</b> {movie.ano}
              </Text>
              <Text>
                <b>Duração:</b> {movie.duracao} min
              </Text>
              <Text>
                <b>Gêneros:</b> {movie.generos}
              </Text>
              <Text>
                <b>Avaliação Média:</b> {movie.classificacoes.avaliacao_media}
              </Text>
              <Text>
                <b>Número de avaliações:</b> {movie.classificacoes.qtd_votos}
              </Text>
              <Text>
                <b>País:</b> {movie.regiao}
              </Text>
              <HStack mt="4" spacing="4">
                <Text>
                  <b>Dias:</b>
                </Text>
                <IconButton icon={<MinusIcon />} size="sm" onClick={() => setDays((prev) => Math.max(1, prev - 1))} />
                <Text>{days}</Text>
                <IconButton icon={<AddIcon />} size="sm" onClick={() => setDays((prev) => prev + 1)} />
                <Text>
                  <b>R$:</b> {Number(movie.preco * days).toFixed(2)}
                </Text>
              </HStack>
            </VStack>
          </HStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={handleConfirm}>
            Alugar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ModalFilme;
