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
        if (sum == 3) {
            return 1;
        } else if (sum == -3) {
            return -1;
        }
        for (let i=0; i<3; i++) {
            sum = grid[i] + grid[i+3] + grid[i+6];
            if (sum == 3) {
                return 1;
            } else if (sum == -3) {
                return -1;
            }
        }
        sum = grid[2] + grid[4] + grid[6];
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

    getWin(grid) {
        let isFull = true;
        for (let j=0; j<3; j++) {
            let sum = 0;
            for (let i=0; i<3; i++) {
                if (grid[j*3+i] == 0) {
                    isFull = false;
                }
                sum += grid[j*3+i];
            }
            if (sum == 3) {
                return [1, "horizontal", j];
            } else if (sum == -3) {
                return [-1, "horizontal", j];
            }
        }
        let sum = 0;
        for (let i=0; i<3; i++) {
            sum += grid[i*3+i];
        }
        if (sum == 3) {
            return [1, "diagonal", 0];
        } else if (sum == -3) {
            return [-1, "diagonal", 0];
        }
        for (let i=0; i<3; i++) {
            sum = grid[i] + grid[i+3] + grid[i+6];
            if (sum == 3) {
                return [1, "vertical", i];
            } else if (sum == -3) {
                return [-1, "vertical", i];
            }
        }
        sum = grid[2] + grid[4] + grid[6];
        if (sum == 3) {
            return [1, "diagonal", 1];
        } else if (sum == -3) {
            return [-1, "diagonal", 1];
        }
        if (isFull) {
            return [0, "draw", 0];
        }
        return [2, "", 0];
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
            values = Array(9).fill(10);
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
            return [val, values];
        } else {
            val = Math.min(...values);
            return [val, values];
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
    document.getElementById('firstPlay').setAttribute('value',true);
    document.getElementById('caution').setAttribute("hidden",true);
    document.getElementsByTagName('body')[0].removeAttribute("class");
    let canvas = document.getElementById('helper');
    let context = canvas.getContext('2d');
    let canvasWidth = canvas.width;
    let canvasHeight = canvas.height;
    context.clearRect(0, 0, canvasWidth, canvasHeight);
}

function renderEnd(sol, userPlayer, direction, type, actualPlay) {
    if (actualPlay) {
        if (sol == userPlayer) {
            const result = document.getElementById('result');
            result.setAttribute('class', 'winner');
            document.getElementsByTagName('body')[0].setAttribute("class", "greenborderpermanent");
            result.hidden = false;
            result.innerText = ":) Congradulations! You Won! :)";
        } else if (sol == 0) {
            const result = document.getElementById('result');
            result.setAttribute('class','draw');
            document.getElementsByTagName('body')[0].setAttribute("class", "greyborderpermanent");
            result.hidden = false;
            result.innerText = ":| Draw! :|";
        } else {
            const result = document.getElementById('result');
            result.setAttribute('class','loser');
            document.getElementsByTagName('body')[0].setAttribute("class", "redborderpermanent");
            result.innerText = ":( Sorry! Computer wins! :(";
            result.hidden = false;
        }
        const cells = document.getElementsByClassName('cell');
        for (let cell of cells) {
            cell.disabled = true;
        }
        document.getElementById('playValue').setAttribute('value',"");
    }
    if (sol != 2) {
        let canvas = document.getElementById('helper');
        let context = canvas.getContext('2d');
        let canvasWidth = canvas.width;
        let canvasHeight = canvas.height;
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        if (sol == 0) {
            return;
        } else {
            if (!actualPlay) {
                if (sol != userPlayer) {
                    context.strokeStyle = "#ff0000";
                    let caution = document.getElementById('caution');
                    let grid = document.getElementById("grid");
                    caution.innerText = "You will lose!";
                    caution.setAttribute('class', "losertext");
                    grid.setAttribute('class', "container zoominout");
                    document.getElementsByTagName('body')[0].setAttribute("class", "redborder");
                    caution.removeAttribute("hidden");
                } else {
                    context.strokeStyle = "#00ff00";
                    let caution = document.getElementById('caution');
                    caution.innerText = "You will win!"
                    caution.setAttribute('class', "winner");
                    document.getElementsByTagName('body')[0].setAttribute("class", "greenborder");
                    caution.removeAttribute("hidden");
                }
            }
            if (sol != userPlayer) {
                context.strokeStyle = "#ff0000";
            } else {
                context.strokeStyle = "#00ff00";
            }
            context.beginPath();
            if (direction == "diagonal") {
                if (type == 0) {
                    // main diagonal
                    context.moveTo(0, 0);
                    context.lineTo(canvasWidth, canvasHeight);
                    context.stroke();
                } else {
                    // secondary diagonal
                    context.moveTo(canvasWidth, 0);
                    context.lineTo(0, canvasHeight);
                    context.stroke();
                }
            } else if (direction == "vertical") {
                let location = Math.floor(type * (canvasWidth/3) + (canvasWidth/6));
                context.moveTo(location, 0);
                context.lineTo(location, canvasHeight);
                context.stroke();
            } else if (direction == "horizontal") {
                let location = Math.floor(type * (canvasHeight/3) + (canvasHeight/6));
                context.moveTo(0, location);
                context.lineTo(canvasWidth, location);
                context.stroke();
            }
        }
    }
}

function computerPlay(actualPlay) {
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
    let [sol,direction,type] = grid.getWin(grid.grid);
    if (sol == 2) {
        let [chosen,vals] = grid.play(currentPlayer);
        if (chosen != 0) {
            for (let i=0; i<vals.length; i++) {
                if (vals[i] == chosen) {
                    let temp_grid = [...values];
                    temp_grid[i] = currentPlayer;
                    let temp_end = grid.end(temp_grid);
                    sol = i;
                    if (temp_end == 1 || temp_end == -1) {
                        break;
                    }
                }
            }
        } else {
            sol = vals.indexOf(chosen);
        }
        grid.grid[sol] = currentPlayer;
        if (!actualPlay) {
            cells[sol].innerText = computer;
            cells[sol].setAttribute("style", "color: grey;");
            let [newsol, direction1, type1] = grid.getWin(grid.grid);
            document.getElementById("computerFuturePlay").setAttribute('value', sol);
            renderEnd(newsol, userPlayer, direction1, type1, false);
            return sol;
        }
        cells[sol].innerText = computer;
        cells[sol].disabled = true;
        [sol,direction,type] = grid.getWin(grid.grid);
        console.log(`current sol=${sol}`);
        if (sol !== 2) {
            renderEnd(sol, userPlayer, direction, type, true);
        }
        return;
    }
    if (actualPlay) {
        renderEnd(sol, userPlayer, direction, type, true);
    }
    return null;
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
    let first = document.getElementById('firstPlay');
    if (first.getAttribute('value') == "true") {
        first.setAttribute("value", "false");
        cells[4].innerText = "X";
        cells[4].disabled = true;
        return;
    }
    computerPlay(true);
}

function play(btn) {
    btn.innerText = document.getElementById('playValue').getAttribute('value');
    btn.setAttribute("style","color: black;");
    let canvas = document.getElementById('helper');
    let context = canvas.getContext('2d');
    let canvasWidth = canvas.width;
    let canvasHeight = canvas.height;
    let grid = document.getElementById("grid");
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    document.getElementById('caution').setAttribute("hidden",true);
    grid.setAttribute('class', "container");
    document.getElementsByTagName('body')[0].removeAttribute("class");
    document.getElementById('firstPlay').setAttribute('value',"false");
    btn.disabled = true;
    if (document.getElementById('assisted').checked) {
        let val = document.getElementById("computerFuturePlay").getAttribute('value');
        if (val != "") {
            document.getElementById('cell'+val).innerText = "";
            document.getElementById('cell'+val).setAttribute("style", "color: black;")
            document.getElementById("computerFuturePlay").setAttribute('value', "");
        }
    }
    computerPlay(true);
}

function assist(btn) {
    if (!document.getElementById('assisted').checked || btn.disabled || document.getElementById('playValue').getAttribute('value') == "" || document.getElementById('firstPlay').getAttribute('value') == "true"){
        return;
    }
    btn.innerText = document.getElementById('playValue').getAttribute('value');
    btn.setAttribute("style","color: grey;");
    let val = computerPlay(false);
    if (val === null) {
        document.getElementById("computerFuturePlay").setAttribute('value', "");
    } else {
        document.getElementById("computerFuturePlay").setAttribute('value', val);
    }
}

function deassist(btn) {
    if (!document.getElementById('assisted').checked || btn.disabled || document.getElementById('firstPlay').getAttribute('value') == "true"){
        return;
    }
    let canvas = document.getElementById('helper');
    let context = canvas.getContext('2d');
    let canvasWidth = canvas.width;
    let canvasHeight = canvas.height;
    let grid = document.getElementById("grid");
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    btn.innerText = "";
    btn.setAttribute("style","color: black;");
    var val = document.getElementById("computerFuturePlay").getAttribute('value');
    document.getElementById('caution').setAttribute("hidden",true);
    grid.setAttribute('class', "container");
    document.getElementsByTagName('body')[0].removeAttribute("class");
    if (val != "") {
        document.getElementById('cell'+val).innerText = "";
        document.getElementById("computerFuturePlay").setAttribute('value', "");
    }
}