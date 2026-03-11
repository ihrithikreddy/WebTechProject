let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;

let playerX = "";
let playerO = "";

let moveCount = 0;
let startTime;

// winning combinations
const winPatterns = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];

// start game
function startGame() {

    playerX = document.getElementById("player1").value || "Player 1";
    playerO = document.getElementById("player2").value || "Player 2";

    startTime = Date.now();
    moveCount = 0;

    document.getElementById("landing").classList.add("hidden");
    document.getElementById("game").classList.remove("hidden");

    updateTurnText();
}

// update turn display
function updateTurnText() {

    const turnText = document.getElementById("turn");

    if(currentPlayer === "X"){
        turnText.innerText = playerX + "'s Turn (X)";
    } else {
        turnText.innerText = playerO + "'s Turn (O)";
    }
}

// handle move
function makeMove(index){

    if(!gameActive || board[index] !== "") return;

    board[index] = currentPlayer;

    document.getElementsByClassName("cell")[index].innerText = currentPlayer;

    moveCount++;

    if(checkWin()){
        showResult(getCurrentPlayerName() + " Wins!");
        return;
    }

    if(!board.includes("")){
        showResult("It's a Draw!");
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";

    updateTurnText();
}

// check winner
function checkWin(){

    for(let pattern of winPatterns){

        let a = pattern[0];
        let b = pattern[1];
        let c = pattern[2];

        if(board[a] && board[a] === board[b] && board[a] === board[c]){
            return true;
        }
    }

    return false;
}

// get player name
function getCurrentPlayerName(){

    return currentPlayer === "X" ? playerX : playerO;
}

// show result
function showResult(text){

    gameActive = false;

    let timeTaken = Math.floor((Date.now() - startTime) / 1000);

    let winner = text.includes("Draw") ? "Draw" : getCurrentPlayerName();

    saveGame(playerX, playerO, winner, moveCount, timeTaken);

    document.getElementById("game").classList.add("hidden");
    document.getElementById("result").classList.remove("hidden");
    document.getElementById("resultText").innerText = text;
}

// save game to backend
async function saveGame(playerX, playerO, winner, moves, timeTaken){

    try{

        const response = await fetch("http://localhost:5000/api/game/save",{
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
        });

        const data = await response.json();

        console.log("Game saved:", data);

    }catch(error){

        console.error("Error saving game:", error);

    }
}

// play again
function playAgain(){

    board = ["","","","","","","","",""];

    currentPlayer = "X";
    gameActive = true;

    moveCount = 0;
    startTime = Date.now();

    document.querySelectorAll(".cell").forEach(cell=>{
        cell.innerText = "";
    });

    document.getElementById("result").classList.add("hidden");
    document.getElementById("game").classList.remove("hidden");

    updateTurnText();
}

// quit game
function quitGame(){

    location.reload();
}