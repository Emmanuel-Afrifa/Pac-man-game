const container = document.querySelector('#container');
let score = document.querySelector('#actual-score')
const width = 16;

// Legend
// 1 = wall
// 0 = pac dots
// 2 = ghost lair
// 3 = power pellet
// empty

grid = [
    1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,3,1,
    1,0,1,1,1,1,1,1,1,1,1,0,0,0,0,1,
    1,0,1,3,0,0,0,0,0,0,0,0,0,1,0,1,
    1,0,1,1,1,1,1,1,1,1,0,1,0,1,0,1,
    1,0,1,0,1,0,0,0,0,0,0,0,0,1,0,1,
    1,0,1,0,1,0,1,1,0,0,1,1,0,1,0,1,
    1,0,1,0,1,0,1,0,0,0,0,1,0,1,0,1,
    1,0,1,0,1,0,1,0,0,0,0,1,0,1,0,1,
    1,0,1,0,1,0,1,1,1,1,1,1,0,1,0,1,
    1,0,1,0,1,0,1,1,1,1,1,1,0,1,0,1,
    1,0,1,0,1,0,1,1,1,1,1,1,0,1,0,1,
    1,0,1,0,1,0,1,1,1,1,1,1,0,1,0,1,
    1,0,1,0,1,0,1,1,1,1,1,1,0,1,0,1,
    1,0,0,0,0,3,0,0,0,0,0,0,0,0,0,1,
    1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
]

function gameStart(){
    createGameBoard();
}


// Create the gameboard
function createGameBoard(){
    for (let i = 0; i < grid.length; i++){
        const square = document.createElement('div');
        square.id = i;
        container.appendChild(square);

        if (grid[i] === 1){
            square.innerHTML = `<img src="./images/wall.png">`;
        }
        if (grid[i] === 0){
            square.innerHTML = `<img src="./images/yellowDot.png">`;
        }
        if (grid[i] === 3){
            square.innerHTML = `<img src="./images/pinkDot.png">`;
            square.classList.add('power-pellet');
        }
    }
}


createGameBoard()

// window.addEventListener('load', gameStart);