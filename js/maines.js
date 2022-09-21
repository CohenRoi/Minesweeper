'use strict'

const MINE = '💣'
const FLAG = '🚩'
const EMPTY = ''


//Model:
var gBoard = createBoard()
var gLevel = { size: 4, mines: 2 }
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}




function onInit() {
    console.table(gBoard);
    renderBoard(gBoard, '.board')
    addMine()
    runGeneration(gBoard)


}


function createBoard() {
    // Create the Matrix  4*4 
    var board = createMat(4, 4)
    // create cells with objects:
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: true,
                isMine: false,
                isMarked: true
            }
            console.log('mines arround:', board[i][j].minesAroundCount)
        }
    }
    return board
}


function addMine() {
    var posArr = getPositionArr(gBoard)

    for (var i = 0; i < 2; i++) {
        var ranIdx = getRandomIntInclusive(0, posArr.length - 1)
        var minePos = posArr[ranIdx]

        gBoard[minePos.i][minePos.j].isMine = true
        renderCell(minePos, MINE)
        console.log('mine pos:', minePos)
    }
    return
}

function renderBoard(board) {
    // console.table(board);
    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += `<tr>\n`
        for (var j = 0; j < board[0].length; j++) {
            var className = getClassName({ i: i, j: j })
            var currCell = board[i][j]

            strHTML += `<td class="${className}"
            onclick="onCellClicked(this,${i},${j})">
            ${currCell.minesAroundCount}</td>`
        }
        strHTML += `</tr>\n`
    }
    // console.log('strHTML', strHTML)
    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}


function runGeneration(board) {
    var newBoard = copyMat(board);
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {

            var numOfNegs = minesAroundNum(i, j, board)
            board[i][j].minesAroundCount = numOfNegs
        }
    }
    return newBoard
}


function minesAroundNum(cellI, cellJ, mat) {
    var mineCount = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j === cellI && j === cellJ) continue
            if (j < 0 || j >= mat[0].length) continue
            var currCell = mat[i][j]
            if (currCell.isMine) mineCount++
        }
    }
    return mineCount
}


function onCellClicked(elCell, i, j) {
    console.log(elCell)
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