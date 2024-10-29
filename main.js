const prompt = require('prompt-sync')({sigint: true});

const HAT = '^';
const HOLE = 'O';
const FIELD_CHARACTER = '░';
const PATH_CHARACTER = '*';

const rows = Number(process.argv[2]);
const columns = Number(process.argv[3]);
const holePercentage = Number(process.argv[4]);

class Field {
    constructor(fieldArray) {
        this.field = fieldArray;
        this.playerRow = 0;
        this.playerCol = 0;
        this.field[this.playerRow][this.playerCol] = PATH_CHARACTER;
    }

    get playerPosition() {
        for (let i = 0; i < this.field.length; i++) {
            for (let j = 0; j < this.field[i].length; j++) {
                if (this.field[i][j] === PATH_CHARACTER) {
                    return [i, j];
                }
            }
        }
    }
    get hatPosition() {
        for (let i = 0; i < this.field.length; i++) {
            for (let j = 0; j < this.field[i].length; j++) {
                if (this.field[i][j] === HAT) {
                    return [i, j];
                }
            }
        }
    }

    get holePosition() {
        for (let i = 0; i < this.field.length; i++) {
            for (let j = 0; j < this.field[i].length; j++) {
                if (this.field[i][j] === HOLE) {
                    return [i, j];
                }
            }
        }
    }
    static generateField(rows, columns, holePercentage) {

        let fieldArray = [];
        for (let i = 0; i < rows; i++) {
            fieldArray[i] = [];
            for (let j = 0; j < columns; j++) {
                let randomNumber = Math.random();
                if (randomNumber <= holePercentage) {
                    fieldArray[i][j] = HOLE;
                } else {
                    fieldArray[i][j] = FIELD_CHARACTER;
                }
            }
        }
    
        // Add a hat character at a random position on the field that is not a hole
        let hatRow;
        let hatCol;
        let validPositionFound = false;
        let attempts = 0;
        while (!validPositionFound && attempts < rows * columns) {
            hatRow = Math.floor(Math.random() * rows);
            hatCol = Math.floor(Math.random() * columns);
            if (fieldArray[hatRow][hatCol] !== HOLE) {
                fieldArray[hatRow][hatCol] = HAT;
                validPositionFound = true;
            }
            attempts++;
        }
        return fieldArray;
    }

    movePlayer(move) {
        let playerRow;
        let playerCol;
        for (let i = this.field.length - 1; i >= 0; i--) {
            for (let j = this.field[i].length - 1; j >= 0; j--) {
                if (this.field[i][j] === PATH_CHARACTER) {
                    playerRow = i;
                    playerCol = j;
                    break;
                }
            }
            if (playerRow !== undefined) {
                break;
            }
        }
    
        let newRow;
        let newCol;
    
        switch (move) {
            case 'a':
                newRow = playerRow;
                newCol = playerCol - 1;
                break;
            case 'd':
                newRow = playerRow;
                newCol = playerCol + 1;
                break;
            case 'w':
                newRow = playerRow - 1;
                newCol = playerCol;
                break;
            case 's':
                newRow = playerRow + 1;
                newCol = playerCol;
                break;
            default:
                console.log('Invalid move. Game over!.');
                return true; // Game is over
        }
    
        // Check if the new position is within the bounds of the field
        if (newRow < 0 || newRow >= this.field.length || newCol < 0 || newCol >= this.field[newRow].length) {
            console.log('YOU FELL OFF THE EDGE!');
            return true; // Game is over
        }
    
        // Check if the new position is a hole
        if (this.field[newRow][newCol] === HOLE) {
            console.log('YOU FELL INTO A HOLE!');
            return true; // Game is over
        }

        if (this.field[newRow][newCol] === HAT) {
            console.log('CONGRATULATIONS! YOU GOT YOUR HAT!');
            this.field[newRow][newCol] = FIELD_CHARACTER; // Remove the hat from the field
            return true;
        }
    
        this.field[playerRow][playerCol] = FIELD_CHARACTER;
        this.field[newRow][newCol] = PATH_CHARACTER;
    
        return false; // Game is not over
    }
    print() {
        console.log(this.field.join('\n').replace(/,/g, ' '));
    }
}
let gameOver = false;
function playGame() {

    if (!gameOver) {
        const fieldArray = Field.generateField(rows, columns, holePercentage);
        const myField = new Field(fieldArray);

        console.log('Game started');

        while (!gameOver) {            
            myField.print();
            const move = prompt(`Which way?\n`).trim();
            gameOver = myField.movePlayer(move); // Update gameOver based on the return value

            if (gameOver) {
                console.log('GAME OVER!');
                break;
            }
            const hatPosition = myField.hatPosition;
            const holePosition = myField.holePosition;
            const playerPosition = myField.playerPosition;
        }
    }
}

while (!gameOver) {
    playGame();
    if (!gameOver) {
        console.log('TRY AGAIN!');
        break;
    }
}