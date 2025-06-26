import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [encontrar, setencontrar] = useState("");
  const [pokemonList, setPokemonList] = useState([]);
  const [fitrarPokemon, setfitrarPokemon] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAllPokemon = async () => {
      try {
        const response = await fetch(
          "https://pokeapi.co/api/v2/pokemon/?limit=100000&offset=0"
        );
        if (!response.ok) {
          throw new Error("Error al obtener los Pokémon");
        }
        const data = await response.json();
        setPokemonList(data.results);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchAllPokemon();
  }, []);

  useEffect(() => {
    if (!encontrar) {
      setfitrarPokemon(null);
      setError("");
      return;
    }

    const matchPokemon = pokemonList.find((p) =>
      p.name.toLowerCase().startsWith(encontrar.toLowerCase())
    );

    if (!matchPokemon) {
      setfitrarPokemon(null);
      setError("No encontrado");
      return;
    }

    const fetchPokemonDetails = async () => {
      setError("");
      try {
        const response = await fetch(matchPokemon.url);
        if (!response.ok) {
          throw new Error("Error al obtener el Pokémon");
        }
        const data = await response.json();
        setfitrarPokemon({
          name: data.name,
          image: data.sprites.front_default,
        });
      } catch (err) {
        setfitrarPokemon(null);
        setError(err.message);
      } 
    };

    fetchPokemonDetails();
  }, [encontrar, pokemonList]);

  return (
    <div className="app">
      <h1>Buscador de Pokémon</h1>
      <input
        type="text"
        placeholder="Pokémon"
        value={encontrar}
        onChange={(e) => setencontrar(e.target.value)}
      />
      {error && <p className="error">{error}</p>}
      {fitrarPokemon && (
        <div className="pokemon">
          <h2>{fitrarPokemon.name}</h2>
          <img src={fitrarPokemon.image} alt={fitrarPokemon.name} />
        </div>
      )}
    </div>
  );
};

export default App;
