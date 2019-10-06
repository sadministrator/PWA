'use strict'

// maps the DEAD and ALIVE states to ints
const DEAD = 0
const ALIVE = 1

// this class takes care of creating and evaluating everything to do
// with the grid arrays which represent the game board and are used
// to create the <table> representation
class Board {
    constructor(width, height) {
        this.width = width
        this.height = height
        this.grid = this.createGrid()
        this.resultGrid = this.createGrid()
    }

    // this function creates a new array of arrays according to
    // width and height and returns the new array
    createGrid() {
        let grid = new Array(parseInt(this.width)).fill(0)

        for(let col = 0; col < this.width; col++) {
            grid[col] = new Array(parseInt(this.height)).fill(0)
        }
        return grid
    }

    // this function zeroes out the grid variable (thus creating
    // a dead grid)
    clearGrid() {
        for(let col = 0; col < this.width; col++) {
            for(let row = 0; row < this.height; row++) {
                this.grid[col][row] = DEAD;
            }
        }
    }

    getWidth() {
        return this.width
    }

    setWidth(width) {
        this.width = width
    }

    getHeight() {
        return this.height
    }

    setHeight(height) {
        this.height = height
    }

    // this function takes a grid, cell coordinates, and cell status in
    // order to update the particular cell
    setCell(grid, x, y, status) {
        x = parseInt(x)
        y = parseInt(y)

        // a check of coordinates to make sure they are within the
        // grid bounds
        if(x < this.width && y < this.height){
            grid[x][y] = status
        }
        else {
            console.error('(' + x + ', ' + y + ') is out of bounds.')
        }
    }

    getCell(x, y) {
        return this.grid[x][y]
    }

    // this function checks a cell's 8 neighors to see if they are
    // DEAD or ALIVE and returns the number of ALIVE neighbors
    liveNeighbors(x, y) {
        x = parseInt(x)
        y = parseInt(y)

        let liveNeighbors = 0;

        liveNeighbors += this.getCell((x + parseInt(this.width) - 1) % parseInt(this.width), (y + parseInt(this.height) + 1) % parseInt(this.height))

        liveNeighbors += this.getCell((x + parseInt(this.width)) % parseInt(this.width), (y + parseInt(this.height) + 1) % parseInt(this.height))

        liveNeighbors += this.getCell((x + parseInt(this.width) + 1) % parseInt(this.width), (y + parseInt(this.height) + 1) % parseInt(this.height))

        liveNeighbors += this.getCell((x + parseInt(this.width) + 1) % parseInt(this.width), (y + parseInt(this.height)) % parseInt(this.height))

        liveNeighbors += this.getCell((x + parseInt(this.width) + 1) % parseInt(this.width), (y + parseInt(this.height) - 1) % parseInt(this.height))

        liveNeighbors += this.getCell((x + parseInt(this.width)) % parseInt(this.width), (y + parseInt(this.height) - 1) % parseInt(this.height))

        liveNeighbors += this.getCell((x + parseInt(this.width) - 1) % parseInt(this.width), (y + parseInt(this.height) - 1) % parseInt(this.height))

        liveNeighbors += this.getCell((x + parseInt(this.width) - 1) % parseInt(this.width), (y + parseInt(this.height)) % parseInt(this.height))

        return liveNeighbors
    }

    // this function takes a cell's coordinates, gets the cell's status
    // and calls liveNeighbors() in order to determine the cell's next state
    // according to the rules of Conway's Game of Life
    nextState(x, y) {
        let neighbors = this.liveNeighbors(x, y)
        let cellStatus = this.getCell(x, y)

        if(cellStatus == ALIVE) {
            if(neighbors != 2 && neighbors != 3) {
                return DEAD
            }
            return ALIVE
        }
        else {
            if(neighbors == 3){
                return ALIVE
            }
            return DEAD
        }
    }

    // this function copies the results of a tick() from the
    // resultGrid to the grid
    copyResults() {
        for(let col = 0; col < this.width; col++) {
            for(let row = 0; row < this.height; row++) {
                this.grid[col][row] = this.resultGrid[col][row]
            }
        }
    }


    // this function writes the next grid state into resultGrid
    // using setCell() and nextState() and then copies the results
    // back into grid using copyResults()
    tick() {
        for(let col = 0; col < this.width; col++) {
            for(let row = 0; row < this.height; row++) {
                this.setCell(this.resultGrid, col, row, this.nextState(col, row));
            }
        }
        this.copyResults()
    }

    // this function returns true if each cell inside of grid is DEAD
    // returns false otherwise
    deadGrid() {
      for(let col = 0; col < this.width; col ++) {
        for(let row = 0; row < this.height; row++) {
          if(this.grid[col][row] == ALIVE){
            return false
          }
        }
      }
      return true
    }

    // This function sends a get request to the url (and uses obj parameter
    // to replace 'this'). The JSON response is parsed, and the resulting
    // array of arrays is copied to grid and rendered
    fetchGrid(url, obj) {
        fetch(url).then(function(response) {
            return response.json()
        }).then(function(data) {
            let newGrid = data.cells
            let width = newGrid.length
            let height = newGrid[0].length

            obj.setWidth(width)
            obj.setHeight(height)
            obj.board.grid = obj.board.createGrid()
            obj.board.resultGrid = obj.board.createGrid()

            for(let col = 0; col < obj.width; col++) {
                for(let row = 0; row < obj.height; row++) {
                    obj.board.grid[col][row] = newGrid[col][row]
                }
            }
            game.createTable()
            game.render()
            console.log(game.getWidth())
            console.log(game.getHeight())
            $('width').val(game.getWidth())
            $('height').val(game.getHeight())
        }).catch(function() {
            console.error("Error fetching.")
        })
    }
}
