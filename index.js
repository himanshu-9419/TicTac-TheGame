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

 // Score row 0-n than column 0-n than diagonal principal-secondary

const grid = [];
const GRID_LENGTH = 5;
let turn = 'X';
let moveCount=0;
let maxRandomChance=10;
let gameComplete = null;
let Score={ X:[],O:[]};
window.winner=null;

function initializeScore(){
    for(let i=0;i<2*GRID_LENGTH+2;i++){
        Score['X'].push(0);
        Score['O'].push(0);
    }
}
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
    if(window.winner){
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
    parent.innerHTML = '<div class="center">Game Over <br/> Winner is: ' + winner + '</div>';
    // alert('Game Over Winner is: ' + playerWin);
}

function onBoxClick() {
    var rowIdx = this.getAttribute("rowIdx");
    var colIdx = this.getAttribute("colIdx");
    rowIdx=(+rowIdx);
    colIdx=(+colIdx)
    let newValue = 1;
    if (grid[colIdx][rowIdx] !== 0) {
        alert('already selected ');
        return;
    }
    grid[colIdx][rowIdx] = newValue;
    changeScore(rowIdx,colIdx);
    let winner=checkWinner();
    
    // change turn
    turn = turn==='X'?'O':'X';
    
    //increment move count
    moveCount++;
    if (!winner && moveCount<GRID_LENGTH*GRID_LENGTH) {
        winner = makeComputerMove();
    }
    window.winner=winner;
    renderMainGrid();
    if (!winner) {
        addClickHandlers();
    } else {
        renderGameCompleteGrid(winner);
    }
}

function checkWinner(){
    let winner=null;
    for(let i=0;i<2*GRID_LENGTH+2;i++){
        if(Score[turn][i]===GRID_LENGTH){
            winner=turn;
            break;
        }
    }
    return winner;
}

function changeScore(rowIdx,colIdx){
    Score[turn][rowIdx]++;
    Score[turn][GRID_LENGTH+colIdx]++;
    if(rowIdx===colIdx) Score[turn][2*GRID_LENGTH]++;
    if(rowIdx===GRID_LENGTH-colIdx-1) Score[turn][2*GRID_LENGTH+1]++;
}

function makeComputerMove(grid) {
    //get X score to prevent that winning
    let xPosition=null;
    let oPosition=null;
    for(let i=0;i<2*GRID_LENGTH+2;i++){
        if(Score['X'][i]===GRID_LENGTH-1){
            xPosition=i;
            break;
        }
    }
    for(let i=0;i<2*GRID_LENGTH+2;i++){
        if(Score['O'][i]===GRID_LENGTH-1){
            oPosition=i;
            break;
        }
    }
    let {col,row}=makeMoveAtForO(oPosition,xPosition);
    console.log(col+" "+row);
    changeScore(row,col);
    let winner=checkWinner();
    // change turn
    turn = turn==='X'?'O':'X';
    
    //increment move count
    moveCount++;
    
    return winner;
}
function makeMoveAtForO(oPosition,xPosition){
    let move={scoreObject:null,index:null};
    let row=null,col=null;
    if(oPosition==null && xPosition==null){
        let randomCell= getRandomCell();
        row=randomCell.row;
        col=randomCell.col;
        grid[col][row] = 2;
        return {row,col};
    }
    if(oPosition!=null){
        move.scoreObject='O';
        move.index=oPosition;
    }
    else{
        move.scoreObject='X';
        move.index=xPosition;
    }
    
    if(move.index<GRID_LENGTH){
        //move in row
        row=move.index;
        for(let i=0;i<GRID_LENGTH;i++){
            if(grid[i][row]===0){
                col=i;
                break
            }
        }
    }
    else if(move.index<2*GRID_LENGTH){
        //move in column
        col=move.index-GRID_LENGTH;
        for(let i=0;i<GRID_LENGTH;i++){
            if(grid[col][i]===0){
                row=i;
                break
            }
        }
    }
    else if(move.index===2*GRID_LENGTH){
        // move in p diagonal
        for(let i=0;i<GRID_LENGTH;i++){
            if(grid[i][i]===0){
                col=i;
                row=i;
                break
            }
        }
    }
    else if(move.index===2*GRID_LENGTH+1){
        // move in diagonal
        for(let i=0;i<GRID_LENGTH;i++){
            if(grid[GRID_LENGTH-1-i][i]===0){
                row=i;
                col=GRID_LENGTH-1-i;
                break
            }
        }
    }
    if(row==null || col==null){
        let randomCell= getRandomCell();
        row=randomCell.row;
        col=randomCell.col;
        grid[col][row] = 2;
        return {row,col};
    }
    grid[col][row] = 2;
    return {row,col};
}
function addClickHandlers() {
    var boxes = document.getElementsByClassName("box");
    for (var idx = 0; idx < boxes.length; idx++) {
        boxes[idx].addEventListener('click', onBoxClick, false);
    }
}

function getRandomCell() {
    let col = Math.floor(Math.random() * GRID_LENGTH);
    let row = Math.floor(Math.random() * GRID_LENGTH);
    let i=0;
    while (grid[col][row] !== 0 && i<maxRandomChance) {
        col = Math.floor(Math.random() * GRID_LENGTH);
        row = Math.floor(Math.random() * GRID_LENGTH);
        i++;
    }
    if(i===maxRandomChance){
        for (let rowIdx = 0; rowIdx < GRID_LENGTH; rowIdx++) {
            for (let colIdx = 0; colIdx < GRID_LENGTH; colIdx++) {
                if(grid[colIdx][rowIdx]===0){
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
initializeScore();
renderMainGrid();
addClickHandlers();