import p5 from 'p5';

function make2DArray (cols, rows) {
	let arr = new Array(cols);

	for(let i = 0; i < arr.length; i++) {
		arr[i] = new Array(rows);
		
		//sets all 'spots' to default state of 0 denoting no sand
		for(let j = 0; j < arr[i].length; j++) {
			arr[i][j] = {value: 0, color: [0, 0, 0] };
		}
	}
	
	return arr;
}

let grid;	//this will hold the array that tracks each 'spot' where sand can go
let w = 5;	//this how many pixels each grain (square) of sand is long
let rows, cols;	//cols = x & rows = y
let currentColor = [255, 255, 255];	//this holds the current fill color
let gravity = 1;

//This sets up grid based on the size of the canvas and sand (w)
function setup (p) {
	let canvas = p.createCanvas(800, 600);
	canvas.parent('canvas-container');
	cols = p.width / w;
	rows = p.height / w;
	grid = make2DArray(cols, rows);

	//sets up event listeners for buttons
	document.getElementById('white-button').addEventListener('click', () => (currentColor = [255, 255, 255]));
	document.getElementById('red-button').addEventListener('click', () => (currentColor = [255, 0, 0]));
	document.getElementById('green-button').addEventListener('click', () => (currentColor = [0, 255, 0]));
	document.getElementById('blue-button').addEventListener('click', () => (currentColor = [0, 0, 255]));
	document.getElementById('grey-button').addEventListener('click', () => (currentColor = [128, 128, 128]));
	document.getElementById('flip-button').addEventListener('click', () => (gravity = gravity*-1));
}

let isPressed = false;

//this sets up the canvas with the empt spots
function draw (p) { 
	p.background(0);
	
	for(let i = 0; i < cols; i++) {
		for(let j = 0; j < rows; j++) {
				p.noStroke();
				p.fill(grid[i][j].color);
				let x = i * w;
				let y = j * w;
				p.square(x, y, w);
		}
	}

	let nextGrid = make2DArray(cols, rows);

	if(isPressed && p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height) {	
		let col = Math.floor(p.mouseX / w);
		let row = Math.floor(p.mouseY / w);
		grid[col][row] = {value: 1, color: currentColor};
	}

	//this handles the drop
	for(let i = 0; i < cols; i++) {
		for(let j = 0; j < rows; j++) {
			let state = grid[i][j];

			if(state.value === 1) {
				let below = grid[i] && grid[i][j + gravity] ? grid[i][j + gravity] : null;
				let dir = p.random([-1, 1]);
				let belowA, belowB;
				if(i + dir >= 0 && i + dir <= cols - 1) belowA = grid[i + dir][j + gravity];
				if(i - dir >= 0 && i - dir <= cols - 1) belowB = grid[i - dir][j + gravity];

				if(j === rows-1 && j+gravity > rows-1){
					nextGrid[i][j] = state;
					continue;
				}

				if(j === 0 && j+gravity < 0) {
					nextGrid[i][j] = state;
					continue;
				}
				
				if(i === 0 && below.value === 1|| i === cols-1 && below.value === 1) {
					nextGrid[i][j] = state;
					continue;
				}

				if (below && below.value === 0) {
						nextGrid[i][j + gravity] = { value: 1, color: state.color };
						nextGrid[i][j] = { value: 0, color: [0, 0, 0] };
				} else if (belowA && belowA.value === 0) {
						nextGrid[i + dir][j + gravity] = { value: 1, color: state.color };
						nextGrid[i][j] = { value: 0, color: [0, 0, 0] };
				} else if (belowB && belowB.value === 0) {
						nextGrid[i - dir][j + gravity] = { value: 1, color: state.color };
						nextGrid[i][j] = { value: 0, color: [0, 0, 0] };
				} else {
					nextGrid[i][j] = { value: 1, color: state.color };
				}
			}
		}
	}
	grid = nextGrid;
}

//this encapsulates the setup, draw, and mousepressed function that then gets p
let sketch = (p) => {
	p.setup = function () {
		setup(p);
	};

	p.draw = function () {
		draw(p);
	};

	p.mousePressed = function () {
		if (p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height) {
			isPressed = true;
		}
	};

	p.mouseReleased = function () {
		if (p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height) {
			isPressed = false;
		}
	};
};
new p5(sketch);
