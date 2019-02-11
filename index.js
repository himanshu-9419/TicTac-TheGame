/**
 * This program is a boilerplate code for the standard tic tac toe game
 * Here the “box” represents one placeholder for either a “X” or a “0”
 * We have a 2D array to represent the arrangement of X or O is a grid
 * 0 -> empty box
 * 1 -> box with X
 * 2 -> box with O
 *
 * Below are the tasks which needs to be completed:
 * Imagine you are playing with the computer so every alternate move should be done by the computer
 * X -> player
 * O -> Computer
 *
 * Winner needs to be decided and has to be flashed
 *
 * Extra points will be given for approaching the problem more creatively
 * 
 */

const grid = [];
const GRID_LENGTH = 3;
let turn = 'X';
let moveCount=0;
let maxRandomChance=10;
let gameComplete = null;
const winCombination = [
    [{
        row: 0,
        col: 0
    }, {
        row: 0,
        col: 1
    }, {
        row: 0,
        col: 2
    }],
    [{
        row: 1,
        col: 0
    }, {
        row: 1,
        col: 1
    }, {
        row: 1,
        col: 2
    }],
    [{
        row: 2,
        col: 0
    }, {
        row: 2,
        col: 1
    }, {
        row: 2,
        col: 2
    }],
    [{
        row: 0,
        col: 0
    }, {
        row: 1,
        col: 0
    }, {
        row: 2,
        col: 0
    }],
    [{
        row: 0,
        col: 1
    }, {
        row: 1,
        col: 1
    }, {
        row: 2,
        col: 1
    }],
    [{
        row: 0,
        col: 2
    }, {
        row: 1,
        col: 2
    }, {
        row: 2,
        col: 2
    }],
    [{
        row: 0,
        col: 0
    }, {
        row: 1,
        col: 1
    }, {
        row: 2,
        col: 2
    }],
    [{
        row: 0,
        col: 2
    }, {
        row: 1,
        col: 1
    }, {
        row: 2,
        col: 0
    }],
];

function initializeGrid() {
    for (let colIdx = 0; colIdx < GRID_LENGTH; colIdx++) {
        const tempArray = [];
        for (let rowidx = 0; rowidx < GRID_LENGTH; rowidx++) {
            tempArray.push(0);
        }
        grid.push(tempArray);
    }
}

function getRowBoxes(colIdx) {
    let rowDivs = '';
    let addCLassToBox='';
    if(gameComplete){
        addCLassToBox='inactive';
    }

    for (let rowIdx = 0; rowIdx < GRID_LENGTH; rowIdx++) {
        let additionalClass = 'darkBackground';
        let content = '';
        const sum = colIdx + rowIdx;
        if (sum % 2 === 0) {
            additionalClass = 'lightBackground'
        }
        const gridValue = grid[colIdx][rowIdx];
        if (gridValue === 1) {
            content = '<span class="cross">X</span>';
        } else if (gridValue === 2) {
            content = '<span class="cross">O</span>';
        }
        additionalClass+=(" "+addCLassToBox);
        rowDivs = rowDivs + '<div colIdx="' + colIdx + '" rowIdx="' + rowIdx + '" class="box ' +
            additionalClass + '">' + content + '</div>';
    }
    return rowDivs;
}

function getColumns() {
    let columnDivs = '';
    for (let colIdx = 0; colIdx < GRID_LENGTH; colIdx++) {
        let coldiv = getRowBoxes(colIdx);
        coldiv = '<div class="rowStyle">' + coldiv + '</div>';
        columnDivs = columnDivs + coldiv;
    }
    return columnDivs;
}

function renderMainGrid() {
    const parent = document.getElementById("grid");
    const columnDivs = getColumns();
    parent.innerHTML = '<div class="columnsStyle">' + columnDivs + '</div>';
}

function renderGameCompleteGrid(winner) {
    const parent = document.getElementById("winner");
    let playerWin = winner.winner === 1 ? 'X' : 'O';
    parent.innerHTML = '<div class="center">Game Over <br/> Winner is: ' + playerWin + '</div>';
    // alert('Game Over Winner is: ' + playerWin);
}

function onBoxClick() {
    var rowIdx = this.getAttribute("rowIdx");
    var colIdx = this.getAttribute("colIdx");
    let newValue = 1;
    if (grid[colIdx][rowIdx] !== 0) {
        alert('already selected ');
        return;
    }
    grid[colIdx][rowIdx] = newValue;
    moveCount++;
    let winner = calculateWinnerOrComputerMove(grid);
    if (!winner.gameComplete && moveCount<9) {
        winner = makeComputerMove(grid);
        moveCount++;
    }
    gameComplete=winner.gameComplete;
    renderMainGrid();
    if (!winner.gameComplete) {
        addClickHandlers();
    } else {
        renderGameCompleteGrid(winner);
    }
}

function makeComputerMove(grid) {
    //return calculateWinnerOrComputerMove(grid,true);
    // heirustics for selecting next move
    let move = {
        gameComplete: false,
        winner: null,
        score: 0,
        cell: null,
    }
    let maxScore = 0,
        optimalCell = null;
    let maxNegScore = 0,
        optimalNegCell = null;
    for (let i = 0; i < winCombination.length; i++) {
        let score = 0,
            cell = null;
        let negScore = 0,
            negCell = null;
        const [a, b, c] = winCombination[i];
        grid[a.row][a.col] === 2 ? score++ : cell = a;
        grid[b.row][b.col] === 2 ? score++ : cell = b;
        grid[c.row][c.col] === 2 ? score++ : cell = c;
        grid[a.row][a.col] === 1 ? negScore-- : negCell = a;
        grid[b.row][b.col] === 1 ? negScore-- : negCell = b;
        grid[c.row][c.col] === 1 ? negScore-- : negCell = c;
        if (score === 2 && grid[cell.row][cell.col] == 0) {
            grid[cell.row][cell.col] = 2;
            move.gameComplete = true;
            move.winner = grid[a.row][a.col];
            move.score = 3;
            return move;
        } else {
            if (score > maxScore) {
                maxScore = score;
                optimalCell = cell;
            };
        }
        if (negScore == -2 && grid[negCell.row][negCell.col] == 0) {
            maxNegScore = -2;
            optimalNegCell = negCell;
        }
    }
    if (maxNegScore === -2) {
        grid[optimalNegCell.row][optimalNegCell.col] = 2;
        move.score = -2;
        move.cell = optimalNegCell;
        return move;
    }
    if (optimalCell == null || grid[optimalCell.row][optimalCell.col] !== 0) {
        optimalCell = getRandomCell(grid);
    }
    move.cell = optimalCell;
    move.score = maxScore;
    grid[optimalCell.row][optimalCell.col] = 2;
    return move;
}

function addClickHandlers() {
    var boxes = document.getElementsByClassName("box");
    for (var idx = 0; idx < boxes.length; idx++) {
        boxes[idx].addEventListener('click', onBoxClick, false);
    }
}

function calculateWinnerOrComputerMove(grid) {
    let move = {
        gameComplete: false,
        winner: null,
        score: 0,
        cell: null,
    }
    for (let i = 0; i < winCombination.length; i++) {
        const [a, b, c] = winCombination[i];
        if (grid[a.row][a.col] && grid[a.row][a.col] === grid[b.row][b.col] && grid[a.row][a.col] === grid[c.row][c.col]) {
            move.gameComplete = true;
            move.winner = grid[a.row][a.col];
            move.score = 3;
            return move;
        }
    }
    return move;
}

function getRandomCell(grid) {
    let col = Math.floor(Math.random() * 3);
    let row = Math.floor(Math.random() * 3);
    let i=0;
    while (grid[row][col] !== 0 && i<maxRandomChance) {
        col = Math.floor(Math.random() * 3);
        row = Math.floor(Math.random() * 3);
        i++;
    }
    if(i===maxRandomChance){
        for (let rowIdx = 0; rowIdx < GRID_LENGTH; rowIdx++) {
            for (let colIdx = 0; colIdx < GRID_LENGTH; colIdx++) {
                if(grid[rowIdx][colIdx]===0){
                    col=colIdx;
                    row=rowIdx;
                    rowIdx = GRID_LENGTH;
                    colIdx = GRID_LENGTH;
                }
            }
        }
    }
    return {
        col: col,
        row: row
    }
}

initializeGrid();
renderMainGrid();
addClickHandlers();