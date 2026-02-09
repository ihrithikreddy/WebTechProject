let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;

let playerX = "";
let playerO = "";

const winningCombos = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

function startGame() {
    playerX = document.getElementById("player1").value || "Player 1";
    playerO = document.getElementById("player2").value || "Player 2";

    document.getElementById("landing").classList.add("hidden");
    document.getElementById("game").classList.remove("hidden");

    updateTurnText();
}

function makeMove(index) {
    if (!gameActive || board[index] !== "") return;

    board[index] = currentPlayer;
    document.getElementsByClassName("cell")[index].innerText = currentPlayer;

    if (checkWin()) {
        showResult(`${getCurrentPlayerName()} Wins!🎉`);
        return;
    }

    if (!board.includes("")) {
        showResult("It's a Draw🤝");
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    updateTurnText();
}

function updateTurnText() {
    document.getElementById("turnText").innerText =
        `${getCurrentPlayerName()}'s Turn (${currentPlayer})`;
}

function getCurrentPlayerName() {
    return currentPlayer === "X" ? playerX : playerO;
}

function checkWin() {
    return winningCombos.some(combo =>
        combo.every(i => board[i] === currentPlayer)
    );
}

function showResult(text) {
    gameActive = false;
    document.getElementById("game").classList.add("hidden");
    document.getElementById("result").classList.remove("hidden");
    document.getElementById("resultText").innerText = text;
}

function playAgain() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = true;

    document.querySelectorAll(".cell").forEach(cell => cell.innerText = "");

    document.getElementById("result").classList.add("hidden");
    document.getElementById("game").classList.remove("hidden");

    updateTurnText();
}

function quitGame() {
    location.reload();
}
