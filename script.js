let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = false;

let playerX = "";
let playerO = "";

let moveCount = 0;
let startTime = 0;

const winningCombos = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

function startGame(){

    playerX = document.getElementById("player1").value || "Player X";
    playerO = document.getElementById("player2").value || "Player O";

    document.getElementById("landing").classList.add("hidden");
    document.getElementById("game").classList.remove("hidden");

    currentPlayer = "X";
    moveCount = 0;
    startTime = Date.now();

    gameActive = true;

    updateTurnText();
}

function makeMove(index){

    if(!gameActive || board[index] !== "") return;

    board[index] = currentPlayer;
    document.getElementsByClassName("cell")[index].innerText = currentPlayer;

    moveCount++;

    if(checkWin()){

        endGame(`${getCurrentPlayerName()} Wins! 🎉`);
        return;
    }

    if(!board.includes("")){

        endGame("It's a Draw 🤝");
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";

    updateTurnText();
}

function updateTurnText(){

    document.getElementById("turn").innerText =
        `${getCurrentPlayerName()}'s Turn (${currentPlayer})`;
}

function getCurrentPlayerName(){

    return currentPlayer === "X" ? playerX : playerO;
}

function checkWin(){

    return winningCombos.some(combo =>
        combo.every(i => board[i] === currentPlayer)
    );
}

function endGame(text){

    gameActive = false;

    let endTime = Date.now();
    let gameTime = Math.floor((endTime - startTime) / 1000);

    document.getElementById("game").classList.add("hidden");
    document.getElementById("result").classList.remove("hidden");

    document.getElementById("resultText").innerText = text;

    let winner = text.includes("Draw") ? "Draw" : getCurrentPlayerName();

    saveGame(playerX, playerO, winner, moveCount, gameTime);
}

function playAgain(){

    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = true;

    moveCount = 0;
    startTime = Date.now();

    document.querySelectorAll(".cell").forEach(cell => cell.innerText = "");

    document.getElementById("result").classList.add("hidden");
    document.getElementById("game").classList.remove("hidden");

    updateTurnText();
}

function quitGame(){

    location.reload();
}

function saveGame(playerX, playerO, winner, moves, timeTaken){

    fetch("http://localhost:5000/api/game/save",{

        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },

        body: JSON.stringify({
            playerX:playerX,
            playerO:playerO,
            winner:winner,
            moves:moves,
            timeTaken:timeTaken
        })

    })
    .then(res => res.json())
    .then(data => console.log("Game saved:",data))
    .catch(err => console.error("Error saving game:",err));
}