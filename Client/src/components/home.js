import React, { useState, useEffect } from "react";
import { Box, SimpleGrid, Image, Text, Button, Tooltip } from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import ModalFilme from "./modalFilme";
import Navbar from "./navbar";
import Carrinho from "./carrinho";
import ModalLogin from "./modalLogin";

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [user, setUser] = useState(undefined);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const disclosureCarrinho = useDisclosure();
  const disclosureModalLogin = useDisclosure();
  const [movieId, setMovieId] = useState(null);
  const [salvarCarrinho, setSalvarCarrinho] = useState(false);
  const [chave, setChave] = useState("");
  const [sessionId, setSessionId] = useState("");

  function generateSessionId() {
    return Math.random().toString(36).substring(2, 15); // Creates a unique string
  }

  const saveUserLocalStorage = (user) => {
    console.log("salvando usuario");
    console.log(user);
    localStorage.setItem("user", JSON.stringify(user));
  };

  useEffect(() => {
    GetCarrinhoRedis();
  }, [user]);

  const fetchMovies = (searchValue = "") => {
    const baseURL = "http://localhost:3001/api/filmes/paginate";
    const page = 0;
    const perPage = 16;

    const url = `${baseURL}${searchValue?.trim() ? `/${encodeURIComponent(searchValue)}` : ""}?page=${page}&per_page=${perPage}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setMovies(data.data);
      })
      .catch((error) => console.error("Error fetching movies:", error));
  };
  // Initial fetch when the component mounts
  useEffect(() => {
    if (localStorage.getItem("user") !== null && typeof localStorage.getItem("user") !== undefined) {
      setUser(JSON.parse(localStorage.getItem("user")));
    }
    if (localStorage.getItem("sessionId") == null || typeof localStorage.getItem("sessionId") == undefined || localStorage.getItem("sessionId") == "") {
      // If it doesn't exist, create a new session ID and store it in localStorage
      console.log("aaaa");
      let sessao = generateSessionId();
      setSessionId(sessao);
      localStorage.setItem("sessionId", sessao);
    } else {
      console.log(`localStorage.getItem("sessionId") = ${localStorage.getItem("sessionId")}`);
      setSessionId(localStorage.getItem("sessionId"));
    }
    if (user) {
      setChave(user.email);
    } else {
      setChave(sessionId);
    }
    fetchMovies();
    console.log(user);
    setTimeout(() => {
      GetCarrinhoRedis();
    }, 500);
  }, []);

  useEffect(() => {
    // Replace 'API_URL' with the actual API endpoint your friend provided.
    if (user) {
      setChave(user.email);
    } else {
      setChave(sessionId);
    }
    console.log("salvando carrinho");
    if (salvarCarrinho) {
      salvarCarrinhoRedis();
    }
  }, [salvarCarrinho]);

  const salvarCarrinhoRedis = () => {
    console.log(user);
    let chaveSet = "";

    if (!user && !localStorage.getItem("user")) {
      chaveSet = localStorage.getItem("sessionId");
    } else {
      chaveSet = user.email || JSON.parse(localStorage.getItem("user")).email;
    }

    if (chaveSet) {
      fetch("http://localhost:3001/api/carrinhos/put", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ carrinhoJson: carrinho, key: `carrinhos-${chaveSet}` }),
      })
        .then((response) => response.json())
        .then(() => setSalvarCarrinho(false))
        .catch((error) => console.error("Error posting data:", error));
    }
  };

  const GetCarrinhoRedis = () => {
    let chaveSet = "";
    console.log(`sessionId:${sessionId}`);
    console.log(`user:${user}`);
    if (!user && !localStorage.getItem("user")) {
      chaveSet = localStorage.getItem("sessionId");
    } else {
      chaveSet = user?.email || JSON.parse(localStorage.getItem("user")).email;
    }
    console.log(chaveSet);
    if (chaveSet) {
      fetch(`http://localhost:3001/api/carrinhos?key=carrinhos-${chaveSet}`)
        .then((response) => response.json())
        .then((data) => {
          console.log(`data: ${data}`);
          console.log(`carrinho: ${carrinho}`);
          console.log(`user: ${user}`);
          if (data && Object.keys(data).length > 0) {
            console.log("aaaaaaaaa");
            setCarrinho(data);
          } else {
            if (!user) {
              setCarrinho([]);
            }
          }
        })
        .catch((error) => console.error("Error fetching carrinhos:", error));
    }
  };

  const toggleCarrinho = () => {
    if (disclosureCarrinho.isOpen) {
      disclosureCarrinho.onClose(); // Close the drawer
    } else {
      disclosureCarrinho.onOpen(); // Open the drawer
    }
  };

  const toggleModalLogin = () => {
    if (disclosureModalLogin.isOpen) {
      disclosureModalLogin.onClose(); // Close the drawer
    } else {
      disclosureModalLogin.onOpen(); // Open the drawer
    }
  };

  useEffect(() => {
    if (movieId !== null) {
      // Fetch the movie data when movieId is set
      fetch(`http://localhost:3001/api/filmes/${movieId}`)
        .then((response) => response.json())
        .then((data) => {
          setSelectedMovie(data); // Set the selected movie data
          console.log(data); // Log the data for debugging
        })
        .catch((error) => console.error("Error fetching movie:", error));
    }
  }, [movieId]);

  const handleCardClick = (movieid) => {
    setMovieId(movieid);
    setModalOpen(true);
  };

  const onCloseModal = () => {
    setModalOpen(false);
    setSalvarCarrinho(true);
  };

  return (
    <>
      <Navbar
        toggleCarrinho={toggleCarrinho}
        toggleModalLogin={toggleModalLogin}
        fetchMovies={fetchMovies}
        GetCarrinhoRedis={GetCarrinhoRedis}
        salvarCarrinhoRedis={salvarCarrinhoRedis}
      />
      <Box bg="white" color="black" minH="100vh" p={4}>
        <SimpleGrid columns={[1, 2, 3, 4]} spacing={4}>
          {movies?.map((movie) => (
            <Box
              key={movie.id}
              bg="brown.700"
              borderRadius="md"
              overflow="hidden"
              boxShadow="md"
              justifySelf="center"
              padding={3}
              minW="32vh"
              maxW="32vh"
              textAlign="center"
            >
              <Image src={movie.capa} alt={movie.titulo} width={"27VH"} />
              <Box p={2}>
                <Tooltip label={movie.titulo} hasArrow>
                  <Text fontWeight="bold" isTruncated>
                    {movie.titulo}
                  </Text>
                </Tooltip>
                <Text isTruncated>{movie.ano}</Text>
                <Text>R$: {movie.preco}</Text>
              </Box>
              <Button mt="2" colorScheme="blue" onClick={() => handleCardClick(movie.id)}>
                Detalhes
              </Button>
            </Box>
          ))}
        </SimpleGrid>
        {selectedMovie && (
          <ModalFilme
            isOpen={isModalOpen}
            onClose={onCloseModal}
            movie={selectedMovie}
            setCarrinho={setCarrinho}
            carrinho={carrinho}
            salvarCarrinhoRedis={salvarCarrinhoRedis}
            setSalvarCarrinho={setSalvarCarrinho}
          />
        )}
        <Carrinho
          isOpen={disclosureCarrinho.isOpen}
          onClose={disclosureCarrinho.onClose}
          carrinho={carrinho}
          setCarrinho={setCarrinho}
          user={user}
          setSalvarCarrinho={setSalvarCarrinho}
        />
        <ModalLogin
          isOpen={disclosureModalLogin.isOpen}
          onClose={disclosureModalLogin.onClose}
          user={user}
          setUser={setUser}
          GetCarrinhoRedis={GetCarrinhoRedis}
          saveUserLocalStorage={saveUserLocalStorage}
          salvarCarrinhoRedis={salvarCarrinhoRedis}
        />
      </Box>
    </>
  );
};

export default Home;
