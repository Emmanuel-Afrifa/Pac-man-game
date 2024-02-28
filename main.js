const container = document.querySelector('#container');
const scoreDisplay = document.querySelector('#actual-score');
let score = 0;
const width = 16;
let pacmanIndexNow = 17;
const squares = [];
let ghosttype = `<img src="./images/ghost.png">`;
const gameOverDisplay = document.querySelector('#game-over-section')
const gameOverScore = document.querySelector('#score-keeper-actual')
const won = document.querySelector('#won');
const gameOverHeading = document.querySelector('#go-heading');
const restartButton = document.querySelector('#restart-button');
let dotsEaten = 0;

// Legend
// 1 = wall
// 0 = pac dots
// 2 = ghost
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
    1,0,1,0,1,0,1,1,1,1,0,1,0,1,0,1,
    1,0,1,0,1,0,0,0,0,0,0,1,0,1,0,1,
    1,0,1,0,1,0,1,0,1,1,1,1,0,1,0,1,
    1,0,1,0,1,0,1,0,0,0,1,1,0,1,0,1,
    1,0,1,0,1,0,1,1,1,0,1,1,0,1,0,1,
    1,0,0,0,0,3,0,0,0,0,0,0,0,0,0,1,
    1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
]

class Ghost {
    constructor(ghostIndex, speed){
        this.startIndex = ghostIndex;
        this.ghostIndex = ghostIndex;
        this.speed = speed;
        this.isScared = false;
        this.timer = NaN;
    }    
}

const ghosts = [new Ghost(85, 150), new Ghost(115, 150), new Ghost(238, 150)];

function gameStart(){

    if (window.innerWidth < 530 || window.innerHeigh < 650){
        alert(`Your screen is too small. Play on a much bigger screen`);
        container.style.backgroundColor = 'black';
        container.style.width = window.innerWidth;
        container.style.height = window.innerHeight;
        return;
    }
    
    createGameBoard();
    createCharacters();
    document.addEventListener('keydown', movePacman);
    ghostings();
}

// Create the gameboard
function createGameBoard(){

    for (let i = 0; i < grid.length; i++){
        const square = document.createElement('div');
        square.id = i;
        container.appendChild(square);
        squares.push(square)

        if (grid[i] === 1){
            square.classList.add('wall');
            square.innerHTML = `<img src="./images/wall.png">`;
        }
        if (grid[i] === 0){
            square.classList.add('pac-dot')
            square.innerHTML = `<img src="./images/yellowDot.png">`;
        }
        if (grid[i] === 3){
            square.innerHTML = `<img src="./images/pinkDot.png">`;
            square.classList.add('power-pellet');
        }
    }
}

function createCharacters(){
    squares[pacmanIndexNow].innerHTML = `<img src="./images/pac0.png">`;
    squares[pacmanIndexNow].classList.add('pacman');
}

function movePacman(e){
    // Removing pac dot class from the starting position for pacman.
    squares[17].classList.remove('pac-dot');

    squares[pacmanIndexNow].classList.remove('pacman');
    squares[pacmanIndexNow].innerHTML = '';
    switch(e.key){
        case 'ArrowRight':
            if (!((pacmanIndexNow + 1)%16 == 0) 
                && !(squares[pacmanIndexNow + 1].classList.contains('wall'))){
                    pacmanIndexNow += 1;
            }
            break;
        case 'ArrowLeft':
            if (!((pacmanIndexNow - 1)%16 == 0)
                && !(squares[pacmanIndexNow - 1].classList.contains('wall'))){
                    pacmanIndexNow -= 1;
            }     
            break;
        case 'ArrowDown':
            if (!((pacmanIndexNow + width) >= 256) &&
                !(squares[pacmanIndexNow + width].classList.contains('wall'))){
                    pacmanIndexNow += width;
            }
            break;
        case 'ArrowUp':
            if (!(squares[pacmanIndexNow - width].classList.contains('wall'))){
                pacmanIndexNow -= width;
            }
            break;
    }
    squares[pacmanIndexNow].classList.add('pacman');
    squares[pacmanIndexNow].innerHTML = `<img src="./images/pac0.png">`;

    updateDisplay(pacmanIndexNow)
    eatenPowerPallet(pacmanIndexNow)
    // checkGameOver()
    checkGameWin()

    
}

function updateDisplay(index, class1='power-pellet', class2='pac-dot'){
    if (squares[index].classList.contains(class2)){
        squares[index].classList.remove(class2);
        score += 1;
        dotsEaten += 1;
    }
    scoreDisplay.innerText = score;
}

function eatenPowerPallet(index){
    if (squares[index].classList.contains('power-pellet')){
        squares[index].classList.remove('power-pellet');
        ghosts.forEach(ghost => ghost.isScared = true )
        dotsEaten += 1;
        score += 10;  
        setTimeout(ghostRecovered, 10000);     
    }
}

function ghostings(){

    // Adding ghosts onto the board
    ghosts.forEach(ghost => {
        squares[ghost.ghostIndex].classList.add('ghost');
        squares[ghost.ghostIndex].innerHTML = `<img src="./images/ghost.png">`;
    })

    // Ghost Movement
    ghosts.forEach(ghost => moveGhost(ghost))
}

function moveGhost(ghost) {
    ghost.timer = setInterval(moving, ghost.speed, ghost, ghosttype);
}

function moving(ghost, ghosttype){
    const directions = [-1,1,width,-width];
    let direction = directions[Math.floor(Math.random()*directions.length)];

    if (!(squares[ghost.ghostIndex + direction].classList.contains('ghost')) &&
        !(squares[ghost.ghostIndex + direction].classList.contains('wall'))){
            squares[ghost.ghostIndex].classList.remove('ghost');
            if (squares[ghost.ghostIndex].classList.contains('pac-dot')){
                squares[ghost.ghostIndex].innerHTML = `<img src="./images/yellowDot.png">`;
            }
            if (squares[ghost.ghostIndex].classList.contains('power-pellet')){
                squares[ghost.ghostIndex].innerHTML = `<img src="./images/pinkDot.png">`;
            }
            if (squares[ghost.ghostIndex].className == ''){
                squares[ghost.ghostIndex].innerHTML = '';
            }

            ghost.ghostIndex += direction;
            squares[ghost.ghostIndex].classList.add('ghost');
            squares[ghost.ghostIndex].innerHTML = ghosttype;
        }
    else {
        direction = directions[Math.floor(Math.random()*directions.length)];
    }

    if (ghost.isScared){
        squares[ghost.ghostIndex].innerHTML = `<img src="./images/scaredGhost.png">`;
        squares[pacmanIndexNow].classList.remove('power-pellet');
    }
    else {
        squares[ghost.ghostIndex].innerHTML = `<img src="./images/ghost.png">`;
    }

    if (ghost.isScared && squares[ghost.ghostIndex].classList.contains('pacman')){
        ghost.isScared = false
        score += 100;
        scoreDisplay.innerText = score;
        squares[ghost.ghostIndex].classList.remove('ghost');
        squares[ghost.ghostIndex].innerHTML = `<img src="./images/pac0.png">`;
        ghost.ghostIndex = ghost.startIndex;
        squares[ghost.ghostIndex].innerHTML = `<img src="./images/ghost.png">`;
    }

    isGameOver(ghost);

}



function isGameOver(ghost) {
    if (!ghost.isScared && squares[pacmanIndexNow].classList.contains('ghost')){
            ghosts.forEach(ghost => clearInterval(ghost.timer));
            document.removeEventListener('keydown', movePacman);
            gameOverScore.innerText = score;
            setTimeout( function(){ 
                gameOverDisplay.style.display = 'flex';
                won.style.display = 'none';
                gameOverHeading.style.display = 'flex';
        }, 500);
    }
}

function checkGameWin(){
    if ((score >= 147 && dotsEaten == 120)){
        ghosts.forEach(ghost => { clearInterval(ghost.timer) });
        document.removeEventListener('keydown', movePacman);
        gameOverScore.innerText = score;
        setTimeout( function(){ 
            gameOverDisplay.style.display = 'flex';
            won.style.display = 'flex';
            gameOverHeading.style.display = 'none';
    }, 500);
    }
}
function ghostRecovered(){
    ghosts.forEach(ghost => {
        ghost.isScared = false;
        squares[ghost.ghostIndex].innerHTML = ghosttype;
    })
    
}


function restart(){
    gameOverDisplay.style.display = 'none';
    score = 0;
    dotsEaten = 0;
    scoreDisplay.innerText = score;
    ghosts.forEach(ghost => {
        ghost.isScared = false;
        ghost.ghostIndex = ghost.startIndex;
    })
    pacmanIndexNow = 17;
    
    for (let square of squares){
        container.removeChild(square);
    }
    squares.splice(0,squares.length);
    gameStart();

}

restartButton.addEventListener('click', restart);


window.addEventListener('load', gameStart);