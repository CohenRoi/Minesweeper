'use strict'

const MINE = '💣'
const FLAG = '🚩'
const EMPTY = ''
const LIVE = '🖤'
//Model:
var gLevel = [
    { size: 4, mines: 2 }
    // { size: 8, mines: 14 },
    // { size: 12, mines: 32 }
];
var gGame;
var gBoard

function onInit(size, mine) {
    // console.table(gBoard);
    // gGame = gGetGame()
    // gBoard = createBoard()
    resetGame(size, mine)
    addMine(mine)
    setMineNegsCount(gBoard)
    renderBoard(gBoard, '.board')
}

function resetGame(size, mine) {
    gGame = gGetGame()
    gBoard = createBoard(size)
    gLevel.size = size
    gLevel.mines = mine
}


function createBoard(size) {
    // Create the Matrix  4*4 
    // var size = gLevel[gGame.gLevelSelected].size;
    var board = createMat(size, size);
    // create cells with objects:
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
            // console.log('mines arround:', board[i][j].minesAroundCount)
        }
    }
    return board
}


function addMine(mine) {
    var posArr = getPositionArr(gBoard);
    
    for (var i = 0; i < mine; i++) {
        var ranIdx = getRandomIntInclusive(0, posArr.length - 1);
        var minePos = posArr[ranIdx];

        gBoard[minePos.i][minePos.j].isMine = true
        posArr.splice(ranIdx, 1);
    }
}

function renderBoard(board, selector) {
    // console.table(board);
    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += `<tr>\n`
        for (var j = 0; j < board[0].length; j++) {
            var className = getClassName({ i: i, j: j })
            var currCell = board[i][j];
            
            var cellValue = EMPTY;
            var isShown = currCell.isShown;
            var isMine = currCell.isMine;

            if (isMine && isShown) cellValue = MINE
            else if (currCell.minesAroundCount > 0 && isShown && !isMine) cellValue = currCell.minesAroundCount

            strHTML += `<td class="${className}"
            onclick="onCellClicked(this,${i},${j})" oncontextmenu="onCellMarked(this,${i},${j},event)">
            ${cellValue}</td>`
        }
        strHTML += `</tr>\n`
    }
    // console.log('strHTML', strHTML)
    var elBoard = document.querySelector(selector)
    elBoard.innerHTML = strHTML
}


function setMineNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j]
            currCell.minesAroundCount = countNegs(i, j, board)

        }
    }
}


function countNegs(cellI, cellJ, board) {
    var mineCount = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= board[0].length) continue
            var currCell = board[i][j]
            if (currCell.isMine) mineCount++
        }
    }
    return mineCount
}


function onCellClicked(elCell, i, j) {

    var currCell = gBoard[i][j];
    if (currCell.isShown) return;
    if (currCell.isMarked) return;
    if (!gGame.isOn && gGame.shownCount !== 0) return

    if (gGame.shownCount === 0) gGame.isOn = true
    var cellValue = EMPTY;
    if (currCell.isMine) {
        gGame.mineCount++
        cellValue = MINE;

    } else if (!currCell.isMine && currCell.minesAroundCount > 0) {
        cellValue = currCell.minesAroundCount
    }
    currCell.isShown = true;
    gGame.shownCount++
    elCell.innerHTML = cellValue
    elCell.style.backgroundColor = 'whitesmoke'
    if (cellValue === EMPTY) {
        expandShown(gBoard, i, j)

    }
    var minesCount = gLevel[gGame.gLevelSelected].mines
    if (minesCount === gGame.mineCount) {
        // gGame.isOn = false
    }

}

function copyMat(mat) {
    var newMat = [];
    for (var i = 0; i < mat.length; i++) {
        newMat[i] = [];
        for (var j = 0; j < mat[0].length; j++) {
            newMat[i][j] = mat[i][j];
        }
    }
    return newMat;
}


function changeLevel(level) {
    if (level === gGame.gLevelSelected) return;
    gGame.gLevelSelected = level;
    gBoard = createBoard();
    onInit();
}

function onCellMarked(elCell, i, j, ev) {
    ev.preventDefault();
    if (!gGame.isOn && gGame.shownCount !== 0) return
    var currCell = gBoard[i][j]
    if (currCell.isShown) return;
    currCell.isMarked = !currCell.isMarked
    if (currCell.isMarked) gGame.markedCount++
    else gGame.markedCount--
    elCell.innerHTML = currCell.isMarked ? FLAG : EMPTY;
}

function gGetGame() {
    return {
        isOn: false,
        gLevelSelected: 0,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
        mineCount: 0,
        liveCount: 3
    }
}


function expandShown(board, cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= board[0].length) continue
            var currCell = board[i][j]
            var cellValue = EMPTY;
            var className = '.' + getClassName({ i: i, j: j })
            if (!currCell.isMine && !currCell.isShown) {
                currCell.isShown = true;
                gGame.shownCount++
                document.querySelector(className).style.backgroundColor = 'whitesmoke'
            }
        }
    }
}