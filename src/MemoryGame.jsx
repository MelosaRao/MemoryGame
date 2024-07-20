import React, { useState, useEffect } from 'react';

const MemoryGame = () => {
  const [pokemon, setPokemon] = useState([]);
  const [cards, setCards] = useState([]);
  const [clickedNames, setClickedNames] = useState([]);
  const [score, setScore] = useState(0);
  const [highestScore, setHighestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [win, setWin] = useState(false);

  const fetchPokemon = async () => {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10');
    const data = await response.json();
    const results = data.results;
    const pokemonData = await Promise.all(results.map(async (pokemon) => {
      const pokeDetailsResponse = await fetch(pokemon.url);
      const pokeDetails = await pokeDetailsResponse.json();
      return { name: pokemon.name, image: pokeDetails.sprites.front_default };
      
    }))
    setPokemon(pokemonData);
    setCards(shuffle([...pokemonData]));
};
  useEffect(() => {
    fetchPokemon();
  }, []);

  useEffect(() => {
    const storedHighestScore = localStorage.getItem('highestScore');
    if (storedHighestScore) {
      setHighestScore(parseInt(storedHighestScore, 10));
    }
  }, []);

  const shuffle = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const handleCardClick = (index) => {
    const clickedCard = cards[index];
    if (clickedNames.includes(clickedCard.name)) {
      setGameOver(true);
      updateHighestScore();
      return;
    }


    setClickedNames([...clickedNames, clickedCard.name]);
    setScore(score + 1);
    reshuffleCards();
    setFlipped(true);
    setTimeout(() => setFlipped(false), 600); // Reset flip state after animation

    if (score + 1 === 10) {
        setWin(true);
        setHighestScore(10)
        localStorage.setItem('highestScore', score);
      }
  };

  const reshuffleCards = () => {
    setCards(shuffle([...pokemon]));
  };

  const updateHighestScore = (win) => {
    if (score > highestScore) {
      setHighestScore(score);
      localStorage.setItem('highestScore', score);
    }
  };

  const resetGame = () => {
    setClickedNames([]);
    setScore(0);
    setGameOver(false);
    setCards(shuffle([...pokemon]));
    setWin(false);
  };

  return (
    <>
    <h1>Memory Game</h1>
    <h3>Click on new card to earn a point. If you click on the same card twice the game ends. Check your score!</h3>
    <div className="memory-game">
      <div className="highest-score">
        <h2>Highest Score: {Math.max(highestScore,score)} Score:{score}</h2>
      </div>
      {gameOver ? (
        <div className="game-over">
          <h2>Game Over!</h2>
          <button onClick={resetGame}>Play Again</button>
        </div>
      ) : win ? (
        <div className="win-message">
          <h2>Congratulations! You Win!</h2>
          <button onClick={resetGame}>Play Again</button>
        </div>
      ) : (
        cards.map((card, index) => (
          <div
            key={index}
            className={`card ${flipped ? 'flipped' : ''}`}
            onClick={() => handleCardClick(index)}
          >
            <div className="card-inner">
                  <img src={card.image} alt={card.name} />
        
              <div className="card-back">
                <img src="https://imageplaceholder.net/200x200/4fe8b8/4fe8b8" alt="Card Back" />
              </div>
            </div>
          </div>
        ))
      )}
    </div>
    </>  
  );
};

export default MemoryGame;
