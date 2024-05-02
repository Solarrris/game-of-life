const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;
const PIXEL_LENGTH = 20;

const canvas = document.querySelector("canvas");
const startButton = document.getElementById("start-game");

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

const context = canvas.getContext("2d");

let grid = [];
let tileValueToPaint = 1;

document.addEventListener("DOMContentLoaded", function () {
    createGrid();
    renderGrid();
})

startButton.addEventListener("click", startGame);

canvas.addEventListener("mousedown", handleMouseDown);
canvas.addEventListener("mouseup", function () {
    canvas.removeEventListener("mousemove", handleMouseMove);
});

function handleMouseDown(event) {
    const row = Math.floor((event.clientY - canvas.offsetTop) / PIXEL_LENGTH);
    const column = Math.floor((event.clientX - canvas.offsetLeft) / PIXEL_LENGTH);
    
    if (grid[row][column] == 0) {
        tileValueToPaint = 1;
    } else {
        tileValueToPaint = 0;
    }

    placeSquare(row, column);

    canvas.addEventListener("mousemove", handleMouseMove);
}

function handleMouseMove(event) {
    const row = Math.floor((event.clientY - canvas.offsetTop) / PIXEL_LENGTH);
    const column = Math.floor((event.clientX - canvas.offsetLeft) / PIXEL_LENGTH);

    placeSquare(row, column);
}

function startGame() {
    startButton.style.display = "none";
    canvas.removeEventListener("mousedown", handleMouseDown);

    setInterval(() => {
        grid = calculateGrid().slice();
        renderGrid();
    }, 30)
};

function placeSquare(row, column) {
    grid[row][column] = tileValueToPaint;
    renderGrid();
}

function createGrid() {
    for (let i = 0; i < CANVAS_WIDTH / PIXEL_LENGTH; i += 1) {
        const row = [];

        for (let j = 0; j < CANVAS_HEIGHT / PIXEL_LENGTH; j += 1) {
            row.push(0);
        }

        grid.push(row);
    }
}

function calculateGrid() {
    let newGrid = [];

    for (let i = 0; i < grid.length; i++) {
        newGrid[i] = grid[i].slice();
    }
    

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid.length; j++) {
            const minRowIndex = Math.max(0, i - 1);
            const maxRowIndex = Math.min(Math.floor(CANVAS_WIDTH / PIXEL_LENGTH) - 1, i + 1);

            const minColumnIndex = Math.max(0, j - 1);
            const maxColumnIndex = Math.min(Math.floor(CANVAS_HEIGHT / PIXEL_LENGTH) - 1, j + 1);

            let neighboursCount = 0;

            for (let n = minRowIndex; n <= maxRowIndex; n++) {
                for (let k = minColumnIndex; k <= maxColumnIndex; k++) {
                    neighboursCount += grid[n][k];
                }
            }

            if (grid[i][j] == 1) {
                if (neighboursCount < 3 || neighboursCount > 4) {
                    newGrid[i][j] = 0;
                }
            } else {
                if (neighboursCount == 3) {
                    newGrid[i][j] = 1;
                }
            }
        }
    }

    return newGrid;
}

function renderGrid() {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid.length; j++) {
            if (grid[i][j] == 1) {
                context.fillStyle = "white";
            } else {
                context.fillStyle = "black";
            }
            
            context.fillRect(PIXEL_LENGTH * j, PIXEL_LENGTH * i, PIXEL_LENGTH, PIXEL_LENGTH);

            context.strokeStyle = "#222222";
            context.strokeRect(PIXEL_LENGTH * j, PIXEL_LENGTH * i, PIXEL_LENGTH, PIXEL_LENGTH);
        }
    }
}