class Grid {
    constructor(values=[]) {
        if (values.length === 9) {
            this.grid = values;
        } else {
            this.grid = Array(9).fill(0);
        }
    }

    end(grid) {
        let isFull = true;
        for (let j=0; j<3; j++) {
            let sum = 0;
            for (let i=0; i<3; i++) {
                if (grid[j*3+i] == 0) {
                    isFull = false;
                }
                sum += grid[j*3+i];
            }
            // console.log(`horizontal sum${j}=${sum}`);
            if (sum == 3) {
                return 1;
            } else if (sum == -3) {
                return -1;
            }
        }
        let sum = 0;
        for (let i=0; i<3; i++) {
            sum += grid[i*3+i];
        }
        // console.log(`diagonal sum=${sum}`);
        if (sum == 3) {
            return 1;
        } else if (sum == -3) {
            return -1;
        }
        for (let i=0; i<3; i++) {
            sum = grid[i] + grid[i+3] + grid[i+6];
            // console.log(`vertical sum${i}=${sum}`);
            if (sum == 3) {
                return 1;
            } else if (sum == -3) {
                return -1;
            }
        }
        sum = grid[2] + grid[4] + grid[6];
        // console.log(`antidiagonal sum=${sum}`);
        if (sum == 3) {
            return 1;
        } else if (sum == -3) {
            return -1;
        }
        if (isFull) {
            return 0;
        }
        return 2;
    }

    getBestPlay(grid, player) {
        let values = [];
        let currentGridValue = this.end(grid);
        if (currentGridValue != 2){
            return currentGridValue;
        }
        for (const [ind,i] of grid.entries()) {
            if (i == 0) {
                let newgrid = [...grid];
                newgrid[ind] = player;
                if (player == 1) {
                    values.push(this.getBestPlay(newgrid, -1));
                } else {
                    values.push(this.getBestPlay(newgrid, 1));
                }
            }
        }
        if (player == 1) {
            return Math.max(...values);
        } else {
            return Math.min(...values);
        }
    }

    play(player) {
        let values;
        if (player == 1) {
            values = Array(9).fill(-10);
        } else {
            values = Array(9).fill(10)
        }
        let currentGridValue = this.end(this.grid);
        if (currentGridValue != 2){
            return currentGridValue;
        }
        for (const [ind,i] of this.grid.entries()) {
            if (i == 0) {
                let newgrid = [...this.grid];
                newgrid[ind] = player;
                if (player == 1) {
                    values[ind] = this.getBestPlay(newgrid, -1);
                } else {
                    values[ind] = this.getBestPlay(newgrid, 1);
                }
            }
        }
        let val;
        console.log(values);
        if (player == 1) {
            val = Math.max(...values);
            return values.indexOf(val);
        } else {
            val = Math.min(...values);
            return values.indexOf(val);
        }
    }
}

function newgame() {
    document.getElementById("cell0").innerText = "";
    document.getElementById("cell1").innerText = "";
    document.getElementById("cell2").innerText = "";
    document.getElementById("cell3").innerText = "";
    document.getElementById("cell4").innerText = "";
    document.getElementById("cell5").innerText = "";
    document.getElementById("cell6").innerText = "";
    document.getElementById("cell7").innerText = "";
    document.getElementById("cell8").innerText = "";
    document.getElementById('grid').hidden = true;
    document.getElementById('option').hidden = false;
    document.getElementById('result').hidden = true;
    document.getElementById('playValue').setAttribute('value',"");
}

function renderEnd(sol, userPlayer) {
    if (sol == userPlayer) {
        const result = document.getElementById('result');
        result.setAttribute('class', 'winner');
        result.hidden = false;
        result.innerText = ":) Congradulations! You Won! :)";
    } else if (sol == 0) {
        const result = document.getElementById('result');
        result.setAttribute('class','draw');
        result.hidden = false;
        result.innerText = ":| Draw! :|";
    } else {
        const result = document.getElementById('result');
        result.setAttribute('class','loser');
        result.innerText = ":( Sorry! Computer wins! :(";
        result.hidden = false;
    }
    const cells = document.getElementsByClassName('cell');
    for (let cell of cells) {
        cell.disabled = true;
    }
    document.getElementById('playValue').setAttribute('value',"");
}

function computerPlay() {
    const cells = document.getElementsByClassName('cell');
    const player = document.getElementById('playValue').getAttribute('value');
    let computer;
    let currentPlayer;
    let userPlayer;
    if (player === ''){
        return;
    } else if (player === 'X') {
        computer = 'O';
        currentPlayer = -1;
        userPlayer = 1;
    } else {
        computer = 'X';
        currentPlayer = 1;
        userPlayer = -1;
    }
    let values = [];
    for (const cell of cells) {
        if (cell.innerText === '') {
            values.push(0);
        } else if (cell.innerText === 'X') {
            values.push(1);
        } else if (cell.innerText === 'O') {
            values.push(-1);
        }
    }
    let grid = new Grid(values);
    let sol = grid.end(grid.grid);
    if (sol == 2) {
        sol = grid.play(currentPlayer);
        grid.grid[sol] = currentPlayer;
        cells[sol].innerText = computer;
        sol = grid.end(grid.grid);
        console.log(`current sol=${sol}`);
        if (sol !== 2) {
            renderEnd(sol, userPlayer);
        }
        return;
    }
    renderEnd(sol, userPlayer);
}

function playAsX() {
    document.getElementById('playValue').setAttribute('value', "X");
    const cells = document.getElementsByClassName('cell');
    for (const cell of cells){
        cell.removeAttribute('disabled')
    }
    document.getElementById('option').hidden = true;
}

function playAsO() {
    document.getElementById('playValue').setAttribute('value', "O");
    const cells = document.getElementsByClassName('cell');
    for (const cell of cells){
        cell.removeAttribute('disabled')
    }
    document.getElementById('option').hidden = true;
    computerPlay();
}
function play(btn) {
    btn.innerText = document.getElementById('playValue').getAttribute('value');
    btn.disabled = true;
    computerPlay();
}