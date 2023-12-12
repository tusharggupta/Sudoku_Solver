const b = null


// ____FUNCTION DEFINITIONS____ // 

function initiate() {
    document.body.classList.add("show-answer");
    document.body.classList.remove("show-input");
    // null -> null
    // populate the board with whatever the user inputted
    var startingBoard = [[]]
    var j = 0
    for (var i = 1; i <= 81; i++){
        const val = document.getElementById(String(i)).value
        if (val == ""){
            startingBoard[j].push(null)
        }
        else { 
            startingBoard[j].push(Number(val))
        }
        if (i % 9 == 0 && i < 81){
            startingBoard.push([])
            j++
        }
    }
    // console.log(startingBoard)
    const inputValid = validBoard(startingBoard)
    if (!inputValid){
        inputIsInvalid()
    }
    else{
        const answer = solve(startingBoard)
        updateBoard(answer, inputValid)
    }
}

function solve(board) {
    // Board -> Board
    // solves the given sudoku board
    // ASSUME the given sudoku board is valid
    if (solved(board)) {
        return board
    }
    else {
        const possibilities = nextBoards(board)
        const validBoards = keepOnlyValid(possibilities)
        return searchForSolution(validBoards)
    }
}


function searchForSolution(boards){
    // List[Board] -> Board or false
    // finds a valid solution to the sudoku problem
    if (boards.length < 1){
        return false
    }
    else {
        // backtracking search for solution
        var first = boards.shift()
        const tryPath = solve(first)
        if (tryPath != false){
            return tryPath
        }
        else{
            return searchForSolution(boards)
        }
    }
}


function solved(board){
    // Board -> Boolean
    // checks to see if the given puzzle is solved
    for (var i = 0; i < 9; i++){
        for (var j = 0; j < 9; j++){
            if (board[i][j] == null){
                return false
            }
        }
    }
    return true
}


function nextBoards(board){ 
    // Board -> List[Board]
    // finds the first emply square and generates 9 different boards filling in that square with numbers 1...9
    var res = []
    const firstEmpty = findEmptySquare(board)
    if (firstEmpty != undefined){
        const y = firstEmpty[0]
        const x = firstEmpty[1]
        for (var i = 1; i <= 9; i++){
            var newBoard = [...board]
            var row = [...newBoard[y]]
            row[x] = i
            newBoard[y] = row
            res.push(newBoard)
        }
    }
    return res
}

function findEmptySquare(board){
    // Board -> [Int, Int] 
    // (get the i j coordinates for the first empty square)
    for (var i = 0; i < 9; i++){
        for (var j = 0; j < 9; j++){
            if (board[i][j] == null) {
                return [i, j]
            }
        }
    }
}


function keepOnlyValid(boards){
    // List[Board] -> List[Board]
    // filters out all of the invalid boards from the list
    var res = []
    for (var i = 0; i < boards.length; i++){
        if (validBoard(boards[i])){
            res.push(boards[i])
        }
    }
    return res
}

// ______TESTS______ //

function validBoard(board){
    // checks to see if given board is valid
    return rowsGood(board) && columnsGood(board) && boxesGood(board)
}

function rowsGood(board){
    // makes sure there are no repeating numbers for each row
    for (var i = 0; i < 9; i++){
        var cur = []
        for (var j = 0; j < 9; j++){
            if (cur.includes(board[i][j])){
                return false
            }
            else if (board[i][j] != null){
                cur.push(board[i][j])
            }
        }
    }
    return true
}

function columnsGood(board){
    // makes sure there are no repeating numbers for each column
    for (var i = 0; i < 9; i++){
        var cur = []
        for (var j = 0; j < 9; j++){
            if (cur.includes(board[j][i])){
                return false
            }
            else if (board[j][i] != null){
                cur.push(board[j][i])
            }
        }
    }
    return true
}


function boxesGood(board){
    const boxCoordinates = [[0, 0], [0, 1], [0, 2],
                            [1, 0], [1, 1], [1, 2],
                            [2, 0], [2, 1], [2, 2]]
    // makes sure there are no repeating numbers for each box
    for (var y = 0; y < 9; y += 3){
        for (var x = 0; x < 9; x += 3){
            // each traversal should examine each box
            var cur = []
            for (var i = 0; i < 9; i++){
                var coordinates = [...boxCoordinates[i]]
                coordinates[0] += y
                coordinates[1] += x
                if (cur.includes(board[coordinates[0]][coordinates[1]])){
                    return false
                }
                else if (board[coordinates[0]][coordinates[1]] != null){
                    cur.push(board[coordinates[0]][coordinates[1]])
                }
            }
        }
    }
    return true
}


function updateBoard(board) {
    // update the DOM with the answer
    if (board == false){
        for (i = 1; i <= 9; i++){
            document.getElementById("row " + String(i)).innerHTML = "NO SOLUTION EXISTS TO THE GIVEN BOARD"
        }
    }
    else{
        for (var i = 1; i <= 9; i++){
            var row = ""
            for (var j = 0; j < 9; j++){
                if (row == ""){
                    row = row + String(board[i - 1][j])
                }
                else {
                    row = row + "\xa0\xa0\xa0\xa0\xa0\xa0\xa0" + String(board[i - 1][j])
                }
            }
            document.getElementById("row " + String(i)).innerHTML = row
        }
    }
}

function inputIsInvalid(){
    // starting board is invalid or puzzle is insolvable
    document.body.classList.add("show-invalid");
    document.body.classList.remove("show-answer");
}

function again(){
    document.body.classList.add("show-input");
    document.body.classList.remove("show-answer");
    document.body.classList.remove("show-invalid");
}

function tough(){
    document.getElementById(String(3)).value = 5;
    document.getElementById(String(4)).value = 3;
    document.getElementById(String(10)).value = 8;
    document.getElementById(String(17)).value = 2;
    document.getElementById(String(20)).value = 7;
    document.getElementById(String(23)).value = 1;
    document.getElementById(String(25)).value = 5;
    document.getElementById(String(28)).value = 4;
    document.getElementById(String(33)).value = 5;
    document.getElementById(String(34)).value = 3;
    document.getElementById(String(38)).value = 1;
    document.getElementById(String(41)).value = 7;
    document.getElementById(String(45)).value = 6;
    document.getElementById(String(48)).value = 3;
    document.getElementById(String(49)).value = 2;
    document.getElementById(String(53)).value = 8;
    document.getElementById(String(56)).value = 6;
    document.getElementById(String(58)).value = 5;
    document.getElementById(String(63)).value = 9;
    document.getElementById(String(66)).value = 4;
    document.getElementById(String(71)).value = 3;
    document.getElementById(String(78)).value = 9;
    document.getElementById(String(79)).value = 7;
}
