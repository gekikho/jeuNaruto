import React, { useState, useEffect } from "react";
import data from "../data/character.json";
import narutoSprite from "../img/narutosprite.gif";
import sasukeSprite from "../img/sasukeSprite.gif";

function Combat() {
  const player = data.perso;
  const enemy = data.enemy;

  const [winner, setWinner] = useState(null);
  const [showGameOver, setShowGameOver] = useState(false);
  const [winnerName, setWinnerName] = useState("");

  const [playerHealth, setPlayerHealth] = useState(player.hp);
  const [enemyHealth, setEnemyHealth] = useState(enemy.hp);
  const [log, setLog] = useState("");
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);

  const attack = (attacker, target, move) => {
    if (playerHealth <= 0 || enemyHealth <= 0) {
      return;
    }
    const damage = move.power;
    let newHp;

    if (target === player) {
      newHp = playerHealth - damage;
      setPlayerHealth(newHp);
    } else {
      newHp = enemyHealth - damage;
      setEnemyHealth(newHp);
    }

    setLog(
      `${attacker.name} attaque ${move.name} et inflige ${damage} dégâts à ${target.name}`
    );

    if (newHp <= 0) {
      setLog(`${target.name} a été vaincu!`);
      setWinner(attacker.name);
      setShowGameOver(true);
      setWinnerName(attacker.name);
    }
    setIsPlayerTurn(!isPlayerTurn);
  };

  const enemyAttack = () => {
    if (playerHealth <= 0 || enemyHealth <= 0) {
      return;
    }

    const randomMoveIndex = Math.floor(Math.random() * enemy.moves.length);
    const selectedMove = enemy.moves[randomMoveIndex];
    attack(enemy, player, selectedMove);
    setIsPlayerTurn(true);
  };

  useEffect(() => {
    if (!isPlayerTurn) {
      const enemyAttackTimeout = setTimeout(() => {
        enemyAttack();
      }, 2000);

      return () => clearTimeout(enemyAttackTimeout);
    }
  }, [isPlayerTurn]);

  const playerStyle = {
    backgroundImage: `url(${player.image})`,
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
  };
  const enemyStyle = {
    backgroundImage: `url(${enemy.image})`,
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
  };

  const resetGame = () => {
    setWinner(null);
    setPlayerHealth(player.hp);
    setEnemyHealth(enemy.hp);
    setLog("");
    setIsPlayerTurn(true);
    document
      .querySelector(".player-area .character")
      .classList.remove("invisible");
    document
      .querySelector(".enemy-area .character")
      .classList.remove("invisible");
  };
  const handlePlayAgain = () => {
    resetGame();
    setShowGameOver(false);
  };

  return (
    <div id="combat-container">
      <div className="player-area">
        <div className="character" style={playerStyle}></div>
        <div id="character-info-naruto">
          <p>HP: {playerHealth}</p>
          <div className="health-bar">
            <div
              className="health-fill"
              style={{ width: `${(playerHealth / player.hp) * 100}%` }}
            ></div>
          </div>
          <img id="naruto" src={narutoSprite} alt="Naruto Sprite" />
        </div>
      </div>
      <p id="chat">{log}</p>
      <div className="enemy-area">
        <div className="character" style={enemyStyle}></div>
        <div id="character-info-sasuke">
          <p>HP: {enemyHealth}</p>
          <div className="health-bar">
            <div
              className="health-fill"
              style={{ width: `${(enemyHealth / enemy.hp) * 100}%` }}
            ></div>
          </div>
          <img id="sasuke" src={sasukeSprite} alt="Sasuke Sprite" />
        </div>
      </div>
      <div className="button-container">
        {player.moves.map((move, index) => (
          <button
            key={index}
            onClick={() => attack(player, enemy, move)}
            disabled={!isPlayerTurn}
          >
            {move.name}
          </button>
        ))}
      </div>
      {showGameOver && (
        <div className="message-box">
          <div className="winner-box centered-box">
            <h2>{winnerName} a gagné!</h2>
            <button onClick={handlePlayAgain}>Rejouer</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Combat;
